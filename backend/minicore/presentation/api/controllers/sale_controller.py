from fastapi import APIRouter, HTTPException
from typing import List
from minicore.core.models.commission import CommissionRule, DateFilter, CommissionSumary
from minicore.application.use_cases.commission_use_case import CommissionUseCase
from minicore.infrastructure.database import db

router = APIRouter()


@router.get("/rules", response_model=List[CommissionRule])
def get_commissions_rules():
    """Obtiene todas las rules de comisión"""
    return db.get_commission_rules()


@router.post("/calculate", response_model=CommissionSumary)
def calculate_commissions(filter: DateFilter):
    """Calcula las comisiones para un rango de fechas"""
    if filter.start_date > filter.end_date:
        raise HTTPException(
            status_code=400,
            detail="La fecha de inicio debe ser menor o igual a la fecha de fin"
        )

    return CommissionUseCase.get_commissions_by_period(
        filter.start_date,
        filter.end_date
    )


@router.get("/seller/{seller_id}")
def obtener_comision_seller(seller_id: int):
    """Obtiene el percentage de comisión que le corresponde a un seller según sus sales totales"""
    sales = db.get_sales_by_seller(seller_id)
    total_sales = sum(v.amount for v in sales)
    percentage = CommissionUseCase.get_percentage_by_commission(total_sales)

    return {
        "seller_id": seller_id,
        "total_sales": total_sales,
        "percentage_comision": percentage
    }