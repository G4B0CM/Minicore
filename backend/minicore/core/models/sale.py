from pydantic import BaseModel, Field
from datetime import date

class SaleBase(BaseModel):
    date: date
    seller_id: int
    amount: float = Field(gt=0, description="The sale must be more than 0")

class Sale(SaleBase):
    id: int
    seller_name: str

    class Config:
        from_attributes = True