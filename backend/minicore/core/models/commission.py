from pydantic import BaseModel
from datetime import date
from typing import List

class CommissionRule(BaseModel):
    id: int
    min_amount: float
    percentage: float

class DateFilter(BaseModel):
    start_date: date
    end_date: date

class CommissionSeller(BaseModel):
    seller_id: int
    seller_name: str
    total_sales: float
    porcentaje_commission: float
    total_commission: float

class Resumencommissiones(BaseModel):
    period: str
    commissiones: List[CommissionSeller]
    total_commissions: float
    total_sales: float