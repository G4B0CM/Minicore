from typing import List
from datetime import date
from minicore.core.models.commission import CommissionSeller, CommissionSumary
from minicore.infrastructure.database import db


class CommissionUseCase:
    @staticmethod
    def get_percentage_by_commission(total_sales: float) -> float:
        rules = db.get_commission_rules()
        for rule in rules:
            if total_sales >= rule.min_amount:
                return rule.percentage
        return 0.0

    @staticmethod
    def get_commissions_by_period(start_date: date, end_date: date) -> CommissionSumary:

        sales_period = db.get_sales_by_period(start_date, end_date)

        sales_for_seller = {}
        for sale in sales_period:
            if sale.seller_id not in sales_for_seller:
                sales_for_seller[sale.seller_id] = {
                    'nombre': sale.seller_name,
                    'total': 0.0,
                    'sales': []
                }
            sales_for_seller[sale.seller_id]['total'] += sale.amount
            sales_for_seller[sale.seller_id]['sales'].append(sale)

        commissiones = []
        total_commissions = 0.0
        total_sales = 0.0

        for seller_id, data in sales_for_seller.items():
            total_sales_seller = data['total']
            porcentaje = CommissionUseCase.get_percentage_by_commission(total_sales_seller)
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

        period_str = f"{start_date.strftime('%d/%m/%Y')} - {end_date.strftime('%d/%m/%Y')}"

        return CommissionSumary(
            period=period_str,
            commissions=commissiones,
            total_commissions=total_commissions,
            total_sales=total_sales
        )