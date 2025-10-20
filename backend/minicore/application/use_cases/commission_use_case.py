from typing import List
from datetime import date
from backend.minicore.core.models.commission import CommissionSeller, CommissionSumary
from backend.minicore.infrastructure.database import db


class CommissionService:
    @staticmethod
    def obtener_porcentaje_Commission(total_sales: float) -> float:
        rules = db.get_commission_rules()
        for rule in rules:
            if total_sales >= rule.min_amount:
                return rule.percentage
        return 0.0

    @staticmethod
    def calcular_Commissiones_por_period(fecha_inicio: date, fecha_fin: date) -> CommissionSumary:

        sales_period = db.get_sales_by_period(fecha_inicio, fecha_fin)

        sales_por_vendedor = {}
        for sale in sales_period:
            if sale.seller_id not in sales_por_vendedor:
                sales_por_vendedor[sale.seller_id] = {
                    'nombre': sale.seller_name,
                    'total': 0.0,
                    'sales': []
                }
            sales_por_vendedor[sale.seller_id]['total'] += sale.amount
            sales_por_vendedor[sale.seller_id]['sales'].append(sale)

        commissiones = []
        total_commissions = 0.0
        total_sales = 0.0

        for seller_id, data in sales_por_vendedor.items():
            total_sales_seller = data['total']
            porcentaje = CommissionService.obtener_porcentaje_Commission(total_sales_seller)
            total_commission = total_sales_seller * porcentaje

            commission = CommissionSeller(
                seller_id=seller_id,
                seller_name=data['nombre'],
                total_sales=total_sales_seller,
                commission_percentage=porcentaje,
                total_commission=total_commission
            )
            commissiones.append(commission)
            total_commissiones += total_commission
            total_sales += total_sales_seller

        commissiones.sort(key=lambda x: x.total_commission, reverse=True)

        period_str = f"{fecha_inicio.strftime('%d/%m/%Y')} - {fecha_fin.strftime('%d/%m/%Y')}"

        return CommissionSumary(
            period=period_str,
            commissions=commissiones,
            total_commissions=total_commissions,
            total_sales=total_sales
        )