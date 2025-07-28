from __future__ import annotations

from typing import List, Tuple

import numpy as np
import pandas as pd
from sqlalchemy import text
from sqlalchemy.engine import Engine

from src.config.settings import Config
from src.forecasting.backtest import backtest_single_series, summarize_backtest
from src.forecasting.prophet_model import forecast_single


class DemandForecastService:
    """
    /**
     * Serwis łączący wszystkie kroki: wczytanie danych, prognoza, walidacja.
     *
     * @param cfg     konfiguracja
     * @param engine  silnik SQLAlchemy
     */
    """
    def __init__(self, cfg: Config, engine: Engine) -> None:
        self.cfg = cfg
        self.engine = engine

        self.df: pd.DataFrame = pd.DataFrame()
        self.forecasts: pd.DataFrame = pd.DataFrame()
        self.backtest_results: pd.DataFrame = pd.DataFrame()
        self.sql_query: str = self._default_sql()

    # ------------------- Public API -------------------

    def load_data(self, sql: str | None = None) -> pd.DataFrame:
        """
        /**
         * Wczytuje dane z bazy do self.df.
         *
         * @param sql  opcjonalne własne zapytanie
         * @return     DataFrame z danymi
         */
        """
        query = sql or self.sql_query
        with self.engine.connect() as conn:
            self.df = pd.read_sql(text(query), conn)
        return self.df

    def forecast_all(self) -> pd.DataFrame:
        """
        /**
         * Prognozuje wszystkie serie (blood_type, province).
         *
         * @return DataFrame z prognozami
         */
        """
        if self.df.empty:
            raise ValueError("Brak danych – wywołaj load_data().")

        results: List[pd.DataFrame] = []
        skipped: List[Tuple] = []

        for (blood_type, province), g in self.df.groupby(['blood_type', 'province']):
            g_filled = self._fill_missing_months(g)
            ts = self._to_prophet_format(g_filled)

            if ts['y'].notna().sum() < 2:
                skipped.append((blood_type, province, "za mało danych"))
                continue

            try:
                fcst = forecast_single(ts, self.cfg).rename(columns={
                    'ds': 'date',
                    'yhat': 'forecast',
                    'yhat_lower': 'lower_ci',
                    'yhat_upper': 'upper_ci'
                })
                fcst['blood_type'] = blood_type
                fcst['province'] = province
                results.append(fcst)
            except Exception as exc:
                skipped.append((blood_type, province, str(exc)))

        self.forecasts = pd.concat(results, ignore_index=True) if results else pd.DataFrame()
        return self.forecasts

    def backtest_all(self) -> pd.DataFrame:
        """
        /**
         * Wykonuje backtest dla każdej serii.
         *
         * @return DataFrame z metrykami backtestu
         */
        """
        if self.df.empty:
            raise ValueError("Brak danych – wywołaj load_data().")

        frames: List[pd.DataFrame] = []
        for (blood_type, province), g in self.df.groupby(['blood_type', 'province']):
            bt_df = backtest_single_series(g[['month_start', 'demand']], self.cfg)
            if not bt_df.empty:
                bt_df['blood_type'] = blood_type
                bt_df['province'] = province
                frames.append(bt_df)

        self.backtest_results = pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()
        return self.backtest_results

    def summarize_backtest(self) -> pd.DataFrame:
        """
        /**
         * Podsumowuje wyniki backtestu.
         *
         * @return DataFrame z metrykami zagregowanymi
         */
        """
        if self.backtest_results.empty:
            raise ValueError("Brak wyników backtestu – wywołaj backtest_all().")
        return summarize_backtest(self.backtest_results)

    def save_forecasts(self) -> None:
        """
        /**
         * Zapisuje prognozy do tabeli Oracle (append).
         *
         * @throws ValueError jeśli brak prognoz lub brak nazwy tabeli
         */
        """
        if self.forecasts.empty:
            raise ValueError("Brak prognoz.")
        if not self.cfg.target_table:
            raise ValueError("Ustaw target_table w Config.")

        df_to_save = self.forecasts.copy()
        df_to_save['date'] = pd.to_datetime(df_to_save['date']).dt.date

        from sqlalchemy import Date, Float, String
        dtype_map = {
            "blood_type": String(10),
            "province": String(50),
            "date": Date(),
            "forecast": Float(),
            "lower_ci": Float(),
            "upper_ci": Float(),
        }
        with self.engine.begin() as conn:
            df_to_save.to_sql(self.cfg.target_table,
                              conn,
                              schema=self.cfg.schema,
                              if_exists="append",
                              index=False,
                              dtype=dtype_map,
                              method="multi")


    @staticmethod
    def _fill_missing_months(df_group: pd.DataFrame, fillna: float = 0.0) -> pd.DataFrame:
        df_group = df_group.sort_values('month_start')
        idx = pd.date_range(df_group['month_start'].min(),
                            df_group['month_start'].max(), freq='MS')
        df_group = (
            df_group.set_index('month_start')
                    .reindex(idx)
                    .rename_axis('month_start')
                    .reset_index()
        )
        df_group['demand'] = df_group['demand'].fillna(fillna)
        return df_group

    @staticmethod
    def _to_prophet_format(df_group: pd.DataFrame) -> pd.DataFrame:
        return df_group.rename(columns={'month_start': 'ds', 'demand': 'y'})[['ds', 'y']]

    @staticmethod
    def _default_sql() -> str:
        return """
            WITH req AS (
              SELECT
                  br.Blood_Type_id                           AS blood_type_id,
                  bt.blood_group || bt.rh_factor             AS blood_type,
                  h.province                                 AS province,
                  TRUNC(bh.changed_at, 'MM')                 AS month_start,
                  SUM(br.amount)                             AS demand
              FROM BLOODPOINT.Blood_Request br
              JOIN BLOODPOINT.Blood_Request_Status_History bh ON bh.Blood_Request_id = br.id
              JOIN BLOODPOINT.Blood_Request_Status s ON s.id = bh.Blood_Request_Status_id
              JOIN BLOODPOINT.Blood_Type bt ON bt.id = br.Blood_Type_id
              JOIN BLOODPOINT.Hospital h ON h.id = br.Hospital_id
              WHERE s.type IN ('ZATWIERDZONA','UTWORZONA')
              GROUP BY br.Blood_Type_id, bt.blood_group || bt.rh_factor, h.province, TRUNC(bh.changed_at, 'MM')
            )
            SELECT * FROM req
            ORDER BY month_start
        """
