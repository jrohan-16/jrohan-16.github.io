import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pandas as pd
import numpy as np
from capital_engine import recalc, apply_overrides, compare

def _base_df():
    d = {
        'period':['24Q4','25Q1','25Q2'],
        'pre_tax_income':[2.029,2.067,2.226],
        'provision':[0.156,0.219,0.254],
        'net_charge_offs':[0.120,0.140,0.150],
        'tax_rate':[0.18,0.18,0.18],
        'rwa':[416,420,425],
        'div_per_share':[1.60,1.60,1.60],
        'shares_start':[398,None,None],
        'buyback_dollars':[0.20,0.20,0.30],
        'buyback_price':[140,140,140],
        'equity_dollars':[0,0,0],
        'equity_price':[140,140,140],
        'at1_issue':[0,0,0],'at1_redm':[0,0,0],
        'cet1_start':[44.0,None,None],'at1_start':[5.1,None,None],
        'acl_start':[6.0,None,None],
        'sub_principal_start':[7.0,None,None],'sub_years_start':[6.0,None,None],
        'sub_issue':[0,0,0],'sub_issue_maturity':[10,10,10],'sub_redemption':[0,0,0]
    }
    return pd.DataFrame(d).set_index('period')

def test_carry_forward():
    df = recalc(_base_df())
    for curr, prev in zip(df.index[1:], df.index[:-1]):
        assert np.isclose(df.at[curr,'shares_start'], df.at[prev,'shares_end'])
        assert np.isclose(df.at[curr,'cet1_start'],   df.at[prev,'cet1_end'])

def test_no_nans_in_starts():
    df = recalc(_base_df())
    assert df[['shares_start','cet1_start','acl_start']].isna().sum().sum() == 0

def test_provision_shock():
    base = recalc(_base_df())
    scen = apply_overrides(_base_df(), {('25Q1','provision'):0.319})
    delta,_ = compare(base, scen, ['cet1_ratio'])
    assert -0.00025 < delta.loc['25Q1','cet1_ratio'] < -0.00015

def test_equity_issuance():
    scen = apply_overrides(_base_df(), {('25Q1','equity_dollars'):1.0})
    delta,_ = compare(recalc(_base_df()), scen, ['cet1_ratio'])
    assert delta.loc['25Q1','cet1_ratio'] > 0.0023

def test_sub_amortisation():
    df = recalc(_base_df())
    assert np.isclose(df.loc['24Q4','recognised_sub'], df.loc['25Q1','recognised_sub'])

def test_total_ratio_consistency():
    df = recalc(_base_df())
    lhs = (df.cet1_end + df.at1_end + df.tier2_end) / df.rwa
    assert np.allclose(lhs, df.total_ratio, rtol=1e-9)
