from __future__ import annotations

from configparser import ConfigParser
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


@dataclass
class Config:
    """
    /**
     * Konfiguracja globalna: połączenie z bazą i ustawienia prognozowania.
     *
     * @param db_user                 użytkownik bazy Oracle
     * @param db_pwd                  hasło bazy Oracle
     * @param db_host                 host bazy
     * @param db_port                 port bazy
     * @param db_service              nazwa usługi Oracle
     * @param horizon                 horyzont prognozy (miesiące)
     * @param min_train_len           minimalna długość treningu (miesiące) dla backtestu
     * @param window_step             krok przesuwania okna (miesiące) w backteście
     * @param yearly_seasonality      czy uwzględnić sezonowość roczną w Prophecie
     * @param weekly_seasonality      czy uwzględnić sezonowość tygodniową w Prophecie
     * @param interval_width          szerokość przedziału ufności (0-1)
     * @param seasonality_mode        tryb sezonowości ("additive" / "multiplicative")
     * @param changepoint_prior_scale skala priora punktów zmiany trendu w Prophecie
     * @param target_table            docelowa tabela w bazie do zapisu prognoz
     * @param schema                  schemat w bazie danych
     */
    """
    db_user: str
    db_pwd: str
    db_host: str = "localhost"
    db_port: int = 1521
    db_service: str = "freepdb1"

    horizon: int = 6
    min_train_len: int = 24
    window_step: int = 3

    yearly_seasonality: bool = True
    weekly_seasonality: bool = False
    interval_width: float = 0.8
    seasonality_mode: str = "additive"
    changepoint_prior_scale: float = 0.05

    target_table: Optional[str] = None
    schema: str = "BLOODPOINT"

    @classmethod
    def from_properties(cls, path: str | Path) -> "Config":
        """
        /**
         * Wczytuje konfigurację z pliku .properties (sekcje [db], [forecast]).
         *
         * @param path  ścieżka do pliku
         * @return      obiekt Config
         */
        """
        parser = ConfigParser()
        read_ok = parser.read(path, encoding="utf-8")
        if not read_ok:
            raise FileNotFoundError(f"Nie mogę odczytać pliku konfiguracyjnego: {path}")

        db = parser["db"] if parser.has_section("db") else {}
        fc = parser["forecast"] if parser.has_section("forecast") else {}

        return cls(
            db_user=db.get("user", ""),
            db_pwd=db.get("password", ""),
            db_host=db.get("host", "localhost"),
            db_port=parser.getint("db", "port", fallback=1521),
            db_service=db.get("service", "freepdb1"),
            schema=db.get("schema", "BLOODPOINT"),
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
