from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from src.config.settings import Config


def build_engine(cfg: Config) -> Engine:
    """
    /**
     * Buduje silnik SQLAlchemy dla bazy Oracle.
     *
     * @param cfg  obiekt konfiguracji
     * @return     Engine SQLAlchemy
     */
    """
    return create_engine(
        f"oracle+oracledb://{cfg.db_user}:{cfg.db_pwd}"
        f"@{cfg.db_host}:{cfg.db_port}/?service_name={cfg.db_service}"
    )
