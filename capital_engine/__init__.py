import json
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


def run():
    """Return a sample capital calculation as a JSON serialisable object."""
    data = {
        "period": ["24Q4", "25Q1", "25Q2"],
        "pre_tax_income": [2.029, 2.067, 2.226],
        "provision": [0.156, 0.219, 0.254],
        "net_charge_offs": [0.120, 0.140, 0.150],
        "tax_rate": [0.18, 0.18, 0.18],
        "rwa": [416, 420, 425],
        "div_per_share": [1.60, 1.60, 1.60],
        "shares_start": [398, None, None],
        "buyback_dollars": [0.20, 0.20, 0.30],
        "buyback_price": [140, 140, 140],
        "equity_dollars": [0, 0, 0],
        "equity_price": [140, 140, 140],
        "at1_issue": [0, 0, 0],
        "at1_redm": [0, 0, 0],
        "cet1_start": [44.0, None, None],
        "at1_start": [5.1, None, None],
        "acl_start": [6.0, None, None],
        "sub_principal_start": [7.0, None, None],
        "sub_years_start": [6.0, None, None],
        "sub_issue": [0, 0, 0],
        "sub_issue_maturity": [10, 10, 10],
        "sub_redemption": [0, 0, 0],
    }
    df = pd.DataFrame(data).set_index("period")
    df = recalc(df)
    return json.loads(df.to_json(orient="table"))
