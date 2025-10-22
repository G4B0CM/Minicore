# Sistema de Comisiones — Frontend (Vite + React + PrimeReact) & Backend (FastAPI)

Aplicación para cálculo y visualización de comisiones por período, con panel de control, detalle por vendedor y gestión de ventas.
Arquitectura frontend + backend desacoplada, lista para despliegue en Render (Web Service + Static Site) y con CORS configurable por entorno.

> Demo funcional: Home (filtro por rango de fechas + KPIs), Usuarios (ventas por vendedor + % comisión), Ventas (tabla con filtros/ordenación/paginación).

## Tabla de contenidos
- Características
- Tecnologías
- Estructura del proyecto
- Variables de entorno
- Instalación y ejecución local
- API (Endoints y ejemplos)
- CORS y seguridad
- Despliegue en Render
- Licencia

## Características

- Panel de Control (Home): filtro de rango de fechas (PrimeReact Calendar) y cálculo de comisiones vía API.
- Usuarios: KPIs por vendedor (total vendido, % comisión, comisión generada) + tabla de ventas del vendedor.
- Ventas: tabla global con paginación, ordenación, búsqueda global y filtro por vendedor.
- UI consistente con PrimeFlex y componentes PrimeReact (Cards, Fieldsets, DataTables, Charts).
- Despliegue en Render separado: Web Service (FastAPI) + Static Site (Vite).

## Tecnologías

#### Frontend
- Vite, React, TypeScript
- PrimeReact, PrimeFlex, PrimeIcons
- Axios

#### Backend
- FastAPI
- Uvicorn
- Pydantic

#### Infra
- Render (Web Service + Static Site)

## Estructura del proyecto

```bash
    /
    ├─ backend/
    │  ├─ minicore/               # paquete de la app (módulos, casos de uso, DB, etc.)
    │  ├─ main.py                 # punto de entrada ASGI (FastAPI)
    │  ├─ pyproject.toml          # dependencias Python (o requirements.txt)
    │  └─ requirements.txt        # (opcional) si usas pip sin poetry/pdm
    └─ frontend/
        ├─ src/
        │  ├─ pages/
        │  │  ├─ Home.tsx          # filtro por fechas + KPIs + tabla de comisiones
        │  │  ├─ Usuarios.tsx      # KPIs por vendedor + tabla de ventas del vendedor
        │  │  └─ Ventas.tsx        # tabla global de ventas con filtros
        │  ├─ services/
        │  │  └─ backend.ts        # axios + servicios tipados
        │  └─ App.tsx              # TabView o Router (según configuración)
        ├─ index.html
        ├─ package.json
        └─ vite.config.ts
```
## Variables de entorno
### Backend (FastAPI)

- ALLOWED_ORIGINS
Lista separada por comas con los orígenes permitidos (CORS).
Ejemplo (Render):
https://<tu-frontend>.onrender.com,http://localhost:5173

> El backend lee ALLOWED_ORIGINS y configura CORSMiddleware con allow_credentials, allow_methods y allow_headers.

### Frontend (Vite)

- VITE_API_BASE_URL
URL base del backend.
>- Local: http://localhost:8000
>- Render: https://<tu-backend>.onrender.com

Puedes crear .env en frontend/:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Instalación y ejecución local
#### Requisitos
- Node.js ≥ 18
- Python ≥ 3.11
- Git

#### Backend
```bash
cd backend
# Opción A: requirements.txt
pip install --upgrade pip
pip install -r requirements.txt

# Opción B: pyproject.toml (poetry/pdm)
# poetry install --no-dev
# pdm install

# Ejecutar backend (ajusta el módulo si tu main está en otra ruta)
uvicorn minicore.main:app --host 0.0.0.0 --port 8000
```
```bash
Frontend
cd frontend
# .env con VITE_API_BASE_URL si lo necesitas
# echo "VITE_API_BASE_URL=http://localhost:8000" > .env

npm ci || npm install
npm run dev
# Vite corre en http://localhost:5173
```

## API (Endpoints y ejemplos)

Base URL: http://localhost:8000 (local) / https://<backend>.onrender.com (prod)

### Usuarios
- GET /api/v1/users/ → User[]

### Ventas
- GET /api/v1/sales/ → Sale[] (acepta ?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&seller_id=...)
- GET /api/v1/sales/seller/{seller_id} → Sale[]

### Comisiones
- GET /api/v1/commissions/rules → CommissionRule[]
- POST /api/v1/commissions/calculate → CommissionSummary
#### Body
```json
{
  "start_date": "2025-10-01",
  "end_date": "2025-10-10"
}
```

#### Respuesta (ejemplo)
```json
{
  "period": "2025-10-01 a 2025-10-10",
  "commissions": [
    {
      "seller_id": 1,
      "seller_name": "Ana Torres",
      "total_sales": 9200.0,
      "commission_percentage": 0.05,
      "total_commission": 460.0
    }
  ],
  "total_commissions": 460.0,
  "total_sales": 9200.0
}
```
- GET /api/v1/commissions/seller/{seller_id} → { seller_id, total_sales, percentage_commission }

### Interfaces relevantes (TS)
```ts
export interface DateFilter { start_date: string; end_date: string; }
export interface CommissionRule { id: number; min_amount: number; percentage: number; }
export interface CommissionSeller {
  seller_id: number; seller_name: string; total_sales: number;
  commission_percentage: number; total_commission: number;
}
export interface CommissionSummary {
  period: string; commissions: CommissionSeller[];
  total_commissions: number; total_sales: number;
}
```

## Despliegue en Render
### Backend — Web Service
- Root Directory: backend
- Build Command: 
```bash 
pip install --upgrade pip && pip install -r requirements.txt
```
- Start Command (ajusta el módulo si aplica): 
```bash 
uvicorn minicore.main:app --host 0.0.0.0 --port $PORT --proxy-headers
```

### Frontend — Static Site
- Root Directory: frontend
- Build Command: 
```bash 
npm ci && npm run build
```
- Publish Directory: dist

- Env Vars:
```bash 
VITE_API_BASE_URL = https://<tu-backend>.onrender.com
```

## Licencia

Este proyecto se distribuye bajo la licencia que tú definas (por ejemplo, MIT).
Crea un archivo LICENSE en la raíz del repo para especificarlo.