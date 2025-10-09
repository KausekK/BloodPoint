from __future__ import annotations

from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from urllib.parse import quote_plus

from src.config.settings import Config

"""
/**
 * Buduje silnik SQLAlchemy dla bazy Oracle.
 *
 * @param cfg  obiekt konfiguracji
 * @return     Engine SQLAlchemy
 */
"""

def build_engine(cfg: Config) -> Engine:
        user = cfg.db_user.strip()
        pwd = quote_plus(cfg.db_pwd)
        host = cfg.db_host.strip()
        port = int(cfg.db_port)
        svc = cfg.db_service.strip()

        url = f"oracle+oracledb://{user}:{pwd}@{host}:{port}/?service_name={svc}"

        engine = create_engine(url, pool_pre_ping=True)

        @event.listens_for(engine, "connect")
        def set_current_schema(dbapi_conn, conn_rec):
            cur = dbapi_conn.cursor()
            cur.execute(f"ALTER SESSION SET CURRENT_SCHEMA={cfg.schema}")
            cur.close()

        return engine
