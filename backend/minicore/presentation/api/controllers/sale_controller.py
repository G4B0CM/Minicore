from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import date
from minicore.core.models.sale import Sale
from minicore.infrastructure.database import db

router = APIRouter()


@router.get("/", response_model=List[Sale])
def get_sales(
        seller_id: Optional[int] = Query(None, description="Filtrar por seller"),
        start_date: Optional[date] = Query(None, description="Fecha de inicio"),
        end_date: Optional[date] = Query(None, description="Fecha de fin")
):
    """Obtiene todas las sales con filtros opcionales"""
    sales = db.get_sales()

    # Aplicar filtros
    if seller_id:
        sales = [v for v in sales if v.seller_id == seller_id]

    if start_date and end_date:
        if start_date > end_date:
            raise HTTPException(status_code=400, detail="La fecha de inicio debe ser menor o igual a la fecha de fin")
        sales = [v for v in sales if start_date <= v.date <= end_date]

    return sales


@router.get("/seller/{seller_id}", response_model=List[Sale])
def sales_by_seller(seller_id: int):
    """Obtiene todas las sales de un seller específico"""
    return db.get_sales_by_seller(seller_id)