from __future__ import annotations

import numpy as np


def smape(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """
    /**
     * Oblicza Symetryczny MAPE (sMAPE) w procentach.
     *
     * @param y_true  tablica wartości rzeczywistych
     * @param y_pred  tablica wartości prognozowanych
     * @return        sMAPE w %
     */
    """
    return 100 * np.mean(2 * np.abs(y_pred - y_true) / (np.abs(y_true) + np.abs(y_pred) + 1e-9))
