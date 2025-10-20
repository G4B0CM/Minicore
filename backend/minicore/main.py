from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from minicore.presentation.api.controllers import user_controller, sale_controller, commission_controller
import uvicorn
import os

app = FastAPI(
    title="Sistema de commissions API",
    description="API para calcular commissions de sales",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_controller.router, prefix="/api/v1/users", tags=["users"])
app.include_router(sale_controller.router, prefix="/api/v1/sales", tags=["sales"])
app.include_router(commission_controller.router, prefix="/api/v1/commissions", tags=["commissions"])

@app.get("/")
def read_root():
    return {"message": "Commissions API working"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)