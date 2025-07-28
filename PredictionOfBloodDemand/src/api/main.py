from __future__ import annotations

from contextlib import asynccontextmanager
from typing import List

import pandas as pd
from fastapi import FastAPI, HTTPException, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.config.settings import Config
from src.db.oracle import build_engine
from src.forecasting.forecast_service import DemandForecastService

class HistoryPoint(BaseModel):
    date: str
    value: float

class ForecastPoint(BaseModel):
    date: str
    forecast: float
    lower_ci: float
    upper_ci: float

class MetaInfo(BaseModel):
    interval_width: float
    blood_type: str
    province: str

class SeriesResponse(BaseModel):
    history: List[HistoryPoint]
    forecast: List[ForecastPoint]
    meta: MetaInfo


@asynccontextmanager
async def lifespan(app: FastAPI):
    cfg = Config.from_properties("application.properties")
    engine = build_engine(cfg)
    service = DemandForecastService(cfg, engine)
    service.load_data()
    service.forecast_all()

    app.state.cfg = cfg
    app.state.service = service
    try:
        yield
    finally:
        engine.dispose()
app = FastAPI(title="Blood Demand Forecast API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:8081"],
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/api")

@router.get(
    "/series",
    response_model=SeriesResponse,
    summary="Historia + prognoza",
    response_description="Dane gotowe do wykresu (historia + prognoza z CI)."
)
def get_series(
    blood_type: str = Query(..., description="Np. 'A+'"),
    province: str = Query(..., description="Np. 'Mazowieckie'")
) -> SeriesResponse:
    service: DemandForecastService = app.state.service
    cfg: Config = app.state.cfg

    if service.df.empty or service.forecasts.empty:
        raise HTTPException(status_code=500, detail="Brak danych lub prognoz.")

    blood_type = blood_type.strip()
    province = province.strip()

    hist_df = (
        service.df[
            (service.df["blood_type"] == blood_type) &
            (service.df["province"]   == province)
        ]
        .rename(columns={"month_start": "date", "demand": "value"})
    )
    if not hist_df.empty:
        hist_df["date"] = pd.to_datetime(hist_df["date"]).dt.strftime("%Y-%m-%d")
        hist_df = hist_df.sort_values("date")

    fc_df = (
        service.forecasts[
            (service.forecasts["blood_type"] == blood_type) &
            (service.forecasts["province"]   == province)
        ]
    )
    if not fc_df.empty:
        fc_df["date"] = pd.to_datetime(fc_df["date"]).dt.strftime("%Y-%m-%d")
        fc_df = fc_df.sort_values("date")

    if hist_df.empty and fc_df.empty:
        raise HTTPException(status_code=404, detail="Nie znaleziono serii dla podanych parametrów.")

    history = [HistoryPoint(**row) for row in hist_df[["date", "value"]].to_dict("records")]
    forecast = [
        ForecastPoint(**row)
        for row in fc_df[["date", "forecast", "lower_ci", "upper_ci"]].to_dict("records")
    ]
    meta = MetaInfo(interval_width=cfg.interval_width, blood_type=blood_type, province=province)

    return SeriesResponse(history=history, forecast=forecast, meta=meta)

app.include_router(router)
