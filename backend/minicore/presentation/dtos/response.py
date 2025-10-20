from pydantic import BaseModel, Field
from typing import Optional, Any

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None

class ErrorResponse(BaseModel):
    success: bool = Field (default= False)
    message: str
    error_code: Optional[str] = Field ( default= None)