from __future__ import annotations
from typing import Optional

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
    forecast: Optional[float] = None
    lower_ci: Optional[float] = None
    upper_ci: Optional[float] = None

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

    # Dopuszczamy brak prognoz globalnie – zwrócimy samą historię
    if getattr(service, "df", None) is None:
        raise HTTPException(status_code=500, detail="Brak danych historycznych (df==None).")
    if getattr(service, "forecasts", None) is None:
        service.forecasts = pd.DataFrame()

    blood_type = blood_type.strip()
    province = province.strip()

    # --- Historia ---
    hist_df = (
        service.df[
            (service.df["blood_type"] == blood_type) &
            (service.df["province"] == province)
        ]
        .rename(columns={"month_start": "date", "demand": "value"})
        .copy()
    )
    if not hist_df.empty:
        hist_df.loc[:, "date"] = pd.to_datetime(hist_df["date"]).dt.strftime("%Y-%m-%d")
        hist_df = hist_df.sort_values("date")
        hist_df.loc[:, "value"] = hist_df["value"].fillna(0.0)

    # --- Prognoza (może być pusta) ---
    fc_df = pd.DataFrame()
    if not service.forecasts.empty:
        fc_df = service.forecasts[
            (service.forecasts["blood_type"] == blood_type) &
            (service.forecasts["province"] == province)
        ].copy()

    if not fc_df.empty:
        # Upewnij się, że kolumny istnieją
        for col in ["forecast", "lower_ci", "upper_ci"]:
            if col not in fc_df.columns:
                fc_df[col] = None
        if "date" not in fc_df.columns:
            raise HTTPException(status_code=500, detail="Prognoza nie zawiera kolumny 'date'.")

        fc_df.loc[:, "date"] = pd.to_datetime(fc_df["date"]).dt.strftime("%Y-%m-%d")
        fc_df = fc_df.sort_values("date")

        # NaN -> None dla JSON/Pydantic (ForecastPoint ma Optional[float])
        num_cols = ["forecast", "lower_ci", "upper_ci"]
        fc_df.loc[:, num_cols] = fc_df[num_cols].where(fc_df[num_cols].notna(), None)

    # --- Gdy dla tej pary nie ma nic ---
    if hist_df.empty and fc_df.empty:
        raise HTTPException(status_code=404, detail="Nie znaleziono serii dla podanych parametrów.")

    # --- Budowa odpowiedzi (jawne rzutowania typów) ---
    history = (
        [HistoryPoint(date=str(r["date"]), value=float(r["value"]))
         for _, r in hist_df[["date", "value"]].iterrows()]
        if not hist_df.empty else []
    )

    forecast = (
        [ForecastPoint(
            date=str(r["date"]),
            forecast=(None if pd.isna(r["forecast"]) else float(r["forecast"])),
            lower_ci=(None if pd.isna(r["lower_ci"]) else float(r["lower_ci"])),
            upper_ci=(None if pd.isna(r["upper_ci"]) else float(r["upper_ci"]))
        ) for _, r in fc_df[["date", "forecast", "lower_ci", "upper_ci"]].iterrows()]
        if not fc_df.empty else []
    )

    meta = MetaInfo(interval_width=cfg.interval_width, blood_type=blood_type, province=province)
    return SeriesResponse(history=history, forecast=forecast, meta=meta)

app.include_router(router)
