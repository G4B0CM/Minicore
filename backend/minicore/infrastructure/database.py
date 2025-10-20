from typing import List
from datetime import date
from minicore.core.models.user import User
from minicore.core.models.sale import Sale
from minicore.core.models.commission import CommissionRule

class FakeDb:
    def __init__(self):
        self._users = [
            User(id=1, name="Perico P"),
            User(id=2, name="Zoila B"),
            User(id=3, name="Aquiles C"),
            User(id=4, name="Johny M")
        ]

        self._sales = [
            Sale(id=1, date=date(2025, 5, 21), seller_id=1, seller_name="Perico P", amount=400.00),
            Sale(id=2, date=date(2025, 5, 29), seller_id=2, seller_name="Zoila B", amount=600.00),
            Sale(id=3, date=date(2025, 6, 3), seller_id=2, seller_name="Zoila B", amount=200.00),
            Sale(id=4, date=date(2025, 6, 9), seller_id=1, seller_name="Perico P", amount=300.00),
            Sale(id=5, date=date(2025, 6, 11), seller_id=3, seller_name="Aquiles C", amount=900.00),
            Sale(id=6, date=date(2025, 6, 14), seller_id=1, seller_name="Perico P", amount=500.00),
            Sale(id=7, date=date(2025, 6, 20), seller_id=4, seller_name="Johny M", amount=750.00),
            Sale(id=8, date=date(2025, 6, 22), seller_id=2, seller_name="Zoila B", amount=450.00),
            Sale(id=9, date=date(2025, 6, 25), seller_id=3, seller_name="Aquiles C", amount=320.00),
            Sale(id=10, date=date(2025, 6, 28), seller_id=4, seller_name="Johny M", amount=180.00),
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