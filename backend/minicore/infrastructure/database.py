from typing import List
from datetime import date
from minicore.core.models.user import User
from minicore.core.models.sale import Sale
from minicore.core.models.commission import CommissionRule

class FakeDb:
    def __init__(self):
        self._users = [
            User(id=1, name="Gabriel C"),
            User(id=2, name="Eduardo S"),
            User(id=3, name="Emilio G"),
            User(id=4, name="Ariel A")
        ]

        self._sales = [
            Sale(id=1, date=date(2025, 5, 21), seller_id=1, seller_name="Gabriel C", amount=400.00),
            Sale(id=2, date=date(2025, 7, 29), seller_id=2, seller_name="Gabriel C", amount=600.00),
            Sale(id=3, date=date(2025, 8, 3), seller_id=2, seller_name="Emilio G", amount=200.00),
            Sale(id=4, date=date(2025, 9, 9), seller_id=1, seller_name="Eduardo S", amount=300.00),
            Sale(id=5, date=date(2025, 10, 11), seller_id=3, seller_name="Ariel A", amount=900.00),
            Sale(id=6, date=date(2025, 10, 14), seller_id=1, seller_name="Eduardo S", amount=500.00),
            Sale(id=7, date=date(2025, 10, 20), seller_id=4, seller_name="Ariel A", amount=750.00),
            Sale(id=8, date=date(2025, 10, 22), seller_id=2, seller_name="Gabriel C", amount=450.00),
            Sale(id=9, date=date(2025, 10, 22), seller_id=3, seller_name="Eduardo S", amount=320.00),
            Sale(id=10, date=date(2025, 10, 21), seller_id=4, seller_name="Ariel A", amount=180.00),
        ]

        self._commission_rules = [
            CommissionRule(id=1, min_amount=1000.0, percentage=0.15),
            CommissionRule(id=2, min_amount=800.0, percentage=0.10),
            CommissionRule(id=3, min_amount=600.0, percentage=0.08),
            CommissionRule(id=4, min_amount=500.0, percentage=0.06),
        ]

    def get_users(self) -> List[User]:
        return self._users

    def get_user_by_id(self, User_id: int) -> User | None:
        return next((u for u in self._users if u.id == User_id), None)

    def get_sales(self) -> List[Sale]:
        return self._sales

    def get_sales_by_period(self, date_inicio: date, date_fin: date) -> List[Sale]:
        return [v for v in self._sales if date_inicio <= v.date <= date_fin]

    def get_sales_by_seller(self, seller_id: int) -> List[Sale]:
        return [v for v in self._sales if v.seller_id == seller_id]

    def get_commission_rules(self) -> List[CommissionRule]:
        return sorted(self._commission_rules, key=lambda x: x.min_amount, reverse=True)

db = FakeDb()