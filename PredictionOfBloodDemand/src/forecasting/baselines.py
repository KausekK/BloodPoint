from __future__ import annotations

from typing import Dict, Callable, Optional

import numpy as np
import pandas as pd


def naive_last(y_train: pd.Series, horizon: int) -> np.ndarray:
    """
    /**
     * Naiwny baseline: powtarza ostatnią obserwację z szeregu.
     *
     * @param y_train  seria ucząca
     * @param horizon  horyzont prognozy
     * @return         tablica z powtórzoną ostatnią wartością
     */
    """
    return np.repeat(y_train.iloc[-1], horizon)


def naive_mean(y_train: pd.Series, horizon: int, n_last: Optional[int] = None) -> np.ndarray:
    """
    /**
     * Naiwny baseline: średnia z całej serii lub ostatnich N obserwacji.
     *
     * @param y_train  seria ucząca
     * @param horizon  horyzont prognozy
     * @param n_last   liczba ostatnich obserwacji; None = wszystkie
     * @return         tablica z wartością średnią
     */
    """
    if n_last is None or n_last > len(y_train):
        return np.repeat(y_train.mean(), horizon)
    return np.repeat(y_train.tail(n_last).mean(), horizon)


BASELINES: Dict[str, Callable] = {
    "last": naive_last,
    "mean_all": lambda y_tr, h: naive_mean(y_tr, h, None),
    "mean_6": lambda y_tr, h: naive_mean(y_tr, h, 6),
}
