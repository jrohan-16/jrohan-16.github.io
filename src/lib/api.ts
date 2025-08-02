export async function runModel() {
  return Promise.resolve(MODEL_JSON);
}

const MODEL_JSON = {
  "schema": {"fields": [
    {"name": "period"},
    {"name": "pre_tax_income"},
    {"name": "provision"},
    {"name": "net_charge_offs"},
    {"name": "tax_rate"},
    {"name": "rwa"},
    {"name": "div_per_share"},
    {"name": "shares_start"},
    {"name": "buyback_dollars"},
    {"name": "buyback_price"},
    {"name": "equity_dollars"},
    {"name": "equity_price"},
    {"name": "at1_issue"},
    {"name": "at1_redm"},
    {"name": "cet1_start"},
    {"name": "at1_start"},
    {"name": "acl_start"},
    {"name": "sub_principal_start"},
    {"name": "sub_years_start"},
    {"name": "sub_issue"},
    {"name": "sub_issue_maturity"},
    {"name": "sub_redemption"},
    {"name": "shares_end"},
    {"name": "cet1_end"},
    {"name": "at1_end"},
    {"name": "recognised_sub"},
    {"name": "tier2_end"},
    {"name": "cet1_ratio"},
    {"name": "total_ratio"}
  ]},
  "data": [
    {"period": "24Q4", "pre_tax_income": 2.029, "provision": 0.156, "net_charge_offs": 0.12, "tax_rate": 0.18, "rwa": 416, "div_per_share": 1.6, "shares_start": 398.0, "buyback_dollars": 0.2, "buyback_price": 140, "equity_dollars": 0, "equity_price": 140, "at1_issue": 0, "at1_redm": 0, "cet1_start": 44.0, "at1_start": 5.1, "acl_start": 6.0, "sub_principal_start": 7.0, "sub_years_start": 6.0, "sub_issue": 0, "sub_issue_maturity": 10, "sub_redemption": 0, "shares_end": 397.99857142857144, "cet1_end": -591.5602542857144, "at1_end": 5.1, "recognised_sub": 7.0, "tier2_end": 7.0, "cet1_ratio": -1.4220198420329675, "total_ratio": -1.3929333035714289},
    {"period": "25Q1", "pre_tax_income": 2.067, "provision": 0.219, "net_charge_offs": 0.14, "tax_rate": 0.18, "rwa": 420, "div_per_share": 1.6, "shares_start": 397.99857142857144, "buyback_dollars": 0.2, "buyback_price": 140, "equity_dollars": 0, "equity_price": 140, "at1_issue": 0, "at1_redm": 0, "cet1_start": -591.5602542857144, "at1_start": 5.1, "acl_start": 6.0, "sub_principal_start": 7.0, "sub_years_start": 6.0, "sub_issue": 0, "sub_issue_maturity": 10, "sub_redemption": 0, "shares_end": 397.9971428571429, "cet1_end": -1227.1551228571432, "at1_end": 5.1, "recognised_sub": 7.0, "tier2_end": 7.0, "cet1_ratio": -2.9217979115646266, "total_ratio": -2.892988387755103},
    {"period": "25Q2", "pre_tax_income": 2.226, "provision": 0.254, "net_charge_offs": 0.15, "tax_rate": 0.18, "rwa": 425, "div_per_share": 1.6, "shares_start": 397.9971428571429, "buyback_dollars": 0.3, "buyback_price": 140, "equity_dollars": 0, "equity_price": 140, "at1_issue": 0, "at1_redm": 0, "cet1_start": -1227.1551228571432, "at1_start": 5.1, "acl_start": 6.0, "sub_principal_start": 7.0, "sub_years_start": 6.0, "sub_issue": 0, "sub_issue_maturity": 10, "sub_redemption": 0, "shares_end": 397.995, "cet1_end": -1862.7530828571432, "at1_end": 5.1, "recognised_sub": 7.0, "tier2_end": 7.0, "cet1_ratio": -4.382948430252101, "total_ratio": -4.3544778420168075}
  ]
};

