from __future__ import annotations

from configparser import ConfigParser
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

@dataclass
class Config:
    # --- DB ---
    db_user: str
    db_pwd: str
    db_host: str = "localhost"
    db_port: int = 1521
    db_service: str = "FREEPDB1"
    schema: Optional[str] = None
    target_table: Optional[str] = None

    # --- Forecast ---
    horizon: int = 6
    min_train_len: int = 24
    window_step: int = 3
    yearly_seasonality: bool = True
    weekly_seasonality: bool = False
    interval_width: float = 0.8
    seasonality_mode: str = "additive"
    changepoint_prior_scale: float = 0.05

    @classmethod
    def from_properties(cls, path: str | Path) -> "Config":
        parser = ConfigParser()
        if not parser.read(path, encoding="utf-8"):
            raise FileNotFoundError(f"Nie mogę odczytać pliku konfiguracyjnego: {path}")

        db = parser["db"] if parser.has_section("db") else {}
        fc = parser["forecast"] if parser.has_section("forecast") else {}

        return cls(
            db_user=db.get("user", ""),
            db_pwd=db.get("password", ""),
            db_host=db.get("host", "localhost"),
            db_port=parser.getint("db", "port", fallback=1521),
            db_service=db.get("service", "FREEPDB1"),
            schema=db.get("schema", None),
            target_table=db.get("target_table", None),

            horizon=parser.getint("forecast", "horizon", fallback=6),
            min_train_len=parser.getint("forecast", "min_train_len", fallback=24),
            window_step=parser.getint("forecast", "window_step", fallback=3),
            yearly_seasonality=parser.getboolean("forecast", "yearly_seasonality", fallback=True),
            weekly_seasonality=parser.getboolean("forecast", "weekly_seasonality", fallback=False),
            interval_width=parser.getfloat("forecast", "interval_width", fallback=0.8),
            seasonality_mode=fc.get("seasonality_mode", "additive"),
            changepoint_prior_scale=parser.getfloat("forecast", "changepoint_prior_scale", fallback=0.05),
        )
