from __future__ import annotations

import pandas as pd
from prophet import Prophet

from src.config.settings import Config


def build_prophet(cfg: Config) -> Prophet:
    """
    /**
     * Buduje model Prophet z parametrami z Config.
     *
     * @param cfg  konfiguracja
     * @return     instancja Prophet
     */
    """
    return Prophet(
        yearly_seasonality=cfg.yearly_seasonality,
        weekly_seasonality=cfg.weekly_seasonality,
        interval_width=cfg.interval_width,
        seasonality_mode=cfg.seasonality_mode,
        changepoint_prior_scale=cfg.changepoint_prior_scale,
    )


def forecast_single(ts: pd.DataFrame, cfg: Config) -> pd.DataFrame:
    """
    /**
     * Trenuje Propheta i zwraca prognozę jednej serii.
     *
     * @param ts   DataFrame z kolumnami ds, y
     * @param cfg  konfiguracja
     * @return     DataFrame z ds, yhat, yhat_lower, yhat_upper
     */
    """
    model = build_prophet(cfg)
    model.fit(ts)
    future = model.make_future_dataframe(periods=cfg.horizon, freq='MS')
    fcst = model.predict(future)[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
    return fcst
