import pandas as pd
import numpy as np
from typing import Dict, Tuple, Iterable


def recalc(df: pd.DataFrame) -> pd.DataFrame:
    """Recalculate capital metrics for each period.

    The input ``df`` must contain the columns defined in ``tests/test_capital_engine.py``.
    Missing starting values are forward filled and end of period values are
    carried forward to the next row.
    """
    df = df.copy()
    start_cols = [
        "shares_start",
        "cet1_start",
        "acl_start",
        "at1_start",
        "sub_principal_start",
        "sub_years_start",
    ]
    df[start_cols] = df[start_cols].ffill()

    for i, idx in enumerate(df.index):
        row = df.loc[idx]
        shares_end = (
            row["shares_start"]
            + row["equity_dollars"] / row["equity_price"]
            - row["buyback_dollars"] / row["buyback_price"]
        )
        df.at[idx, "shares_end"] = shares_end

        net_income = (
            row["pre_tax_income"] - row["provision"] - row["net_charge_offs"]
        ) * (1 - row["tax_rate"])
        dividends = row["div_per_share"] * shares_end
        cet1_end = (
            row["cet1_start"]
            + net_income
            - dividends
            - row["buyback_dollars"]
            + row["equity_dollars"]
        )
        df.at[idx, "cet1_end"] = cet1_end

        at1_end = row["at1_start"] + row["at1_issue"] - row["at1_redm"]
        df.at[idx, "at1_end"] = at1_end

        recognised_sub = row["sub_principal_start"]
        df.at[idx, "recognised_sub"] = recognised_sub

        tier2_end = recognised_sub + row["sub_issue"] - row["sub_redemption"]
        df.at[idx, "tier2_end"] = tier2_end

        df.at[idx, "cet1_ratio"] = cet1_end / row["rwa"]
        df.at[idx, "total_ratio"] = (cet1_end + at1_end + tier2_end) / row["rwa"]

        if i + 1 < len(df.index):
            next_idx = df.index[i + 1]
            df.at[next_idx, "shares_start"] = shares_end
            df.at[next_idx, "cet1_start"] = cet1_end
            df.at[next_idx, "at1_start"] = at1_end
            df.at[next_idx, "acl_start"] = row["acl_start"]
            df.at[next_idx, "sub_principal_start"] = row["sub_principal_start"]
            df.at[next_idx, "sub_years_start"] = row["sub_years_start"]

    return df


def apply_overrides(
    df: pd.DataFrame, overrides: Dict[Tuple[str, str], float]
) -> pd.DataFrame:
    """Apply scenario overrides and recalc."""
    df = df.copy()
    for (period, col), val in overrides.items():
        df.loc[period, col] = val
    return recalc(df)


def compare(
    base: pd.DataFrame, scen: pd.DataFrame, metrics: Iterable[str]
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Return delta of ``metrics`` between scenario and base results."""
    delta = scen[metrics] - base[metrics]
    return delta, scen
