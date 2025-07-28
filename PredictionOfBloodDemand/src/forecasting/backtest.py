from __future__ import annotations

from typing import Dict, List

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error


from src.config.settings import Config
from src.forecasting.baselines import BASELINES
from src.forecasting.metrics import smape
from src.forecasting.prophet_model import build_prophet


def backtest_single_series(df_series: pd.DataFrame, cfg: Config) -> pd.DataFrame:
    """
    /**
     * Rolling-origin backtest pojedynczej serii.
     *
     * @param df_series  DataFrame z kolumnami month_start, demand
     * @param cfg        konfiguracja
     * @return           DataFrame z metrykami per okno walidacji
     */
    """
    df_series = _fill_missing_months(df_series)
    df_series = _to_prophet_format(df_series)

    n = len(df_series)
    h = cfg.horizon
    rows: List[Dict] = []

    if n < cfg.min_train_len + h:
        return pd.DataFrame()

    for train_end in range(cfg.min_train_len, n - h + 1, cfg.window_step):
        train = df_series.iloc[:train_end]
        test = df_series.iloc[train_end:train_end + h]

        model = build_prophet(cfg)
        model.fit(train)
        future = model.make_future_dataframe(periods=h, freq='MS')
        fcst = model.predict(future).iloc[-h:][['ds', 'yhat']]

        y_tr = train['y']
        y_test = test['y'].values
        yhat_prophet = fcst['yhat'].values

        row: Dict[str, object] = {
            'test_start': test['ds'].iloc[0],
            'mae_prophet': mean_absolute_error(y_test, yhat_prophet),
            'rmse_prophet': float(np.sqrt(mean_squared_error(y_test, yhat_prophet))),
            'smape_prophet': smape(y_test, yhat_prophet),
        }

        for name, func in BASELINES.items():
            yhat_base = func(y_tr, h)
            row[f'mae_{name}'] = mean_absolute_error(y_test, yhat_base)

        rows.append(row)

    return pd.DataFrame(rows)


def summarize_backtest(df_bt: pd.DataFrame) -> pd.DataFrame:
    """
    /**
     * Agreguje metryki backtestu po (blood_type, province).
     *
     * @param df_bt  DataFrame z metrykami
     * @return       podsumowanie metryk (średnie) i wskaźniki pochodne
     */
    """
    agg_dict = {
        'mae_prophet': 'mean',
        'rmse_prophet': 'mean',
        'smape_prophet': 'mean',
    }
    if 'mae_last' in df_bt.columns:
        agg_dict['mae_last'] = 'mean'

    summary = (df_bt.groupby(['blood_type', 'province'])
               .agg(agg_dict)
               .reset_index())

    if 'mae_last' in summary.columns:
        summary['mase'] = summary['mae_prophet'] / summary['mae_last']
        summary['gain_vs_last_pct'] = 100 * (summary['mae_last'] / summary['mae_prophet'] - 1)
    else:
        summary['mase'] = np.nan
        summary['gain_vs_last_pct'] = np.nan

    summary['accuracy_pct'] = 100 - summary['smape_prophet']
    return summary

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


def _to_prophet_format(df_group: pd.DataFrame) -> pd.DataFrame:
    return df_group.rename(columns={'month_start': 'ds', 'demand': 'y'})[['ds', 'y']]
