import axios, { AxiosError, type AxiosResponse } from 'axios';

export interface User {
    id: number;
    name: string;
}

export interface Sale {
    id: number;
    date: string;
    seller_id: number;
    amount: number;
    seller_name: string;
}

export interface CommissionRule {
    id: number;
    min_amount: number;
    percentage: number;
}

export interface DateFilter {
    start_date: string;
    end_date: string;
}

export interface CommissionSeller {
    seller_id: number;
    seller_name: string;
    total_sales: number;
    commission_percentage: number;
    total_commission: number;
}

export interface CommissionSumary {
    period: string;
    commissions: CommissionSeller[];
    total_commissions: number;
    total_sales: number;
}

// endpoint custom: GET /comisiones/seller/{seller_id}
export interface SellerCommissionPercentage {
    seller_id: number;
    total_sales: number;
    percentage_commission: number;
}

// Tipo para los parámetros opcionales de `ventasAPI.obtenerTodas`
export interface SaleParams {
    start_date?: string;
    end_date?: string;
    seller_id?: number;
}


// --- 2. Configuración de Axios ---

// MEJORA: Vite usa `import.meta.env` en lugar de `process.env`
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- 3. Interceptores Mejorados ---

api.interceptors.response.use(
    // MEJORA: Devolvemos `response.data` directamente en caso de éxito.
    // Así, tus componentes no tienen que hacer `respuesta.data.propiedad`.
    (response: AxiosResponse) => response.data,

    // Interceptor para manejar errores globalmente
    (error: AxiosError) => {
        // MEJORA: Manejo de errores más detallado
        if (error.response) {
            // El servidor respondió con un código de error (4xx, 5xx)
            console.error('Error de respuesta:', error.response.data);
            console.error('Status:', error.response.status);
        } else if (error.request) {
            // La solicitud se hizo, pero no se recibió respuesta (ej. red caída)
            console.error('Sin respuesta del servidor:', error.request);
        } else {
            // Error al configurar la solicitud
            console.error('Error de configuración Axios:', error.message);
        }

        // Rechazamos la promesa para que el `.catch()` en la llamada original se active
        return Promise.reject(error);
    }
);

// --- 4. Servicios de API Tipados ---

export const usuariosAPI = {
    obtenerTodos: (): Promise<User[]> => api.get('/api/v1/users/'),

    obtenerPorId: (id: number): Promise<User> => api.get(`/api/v1/users/${id}`),
};

export const ventasAPI = {
    obtenerTodas: (params: SaleParams = {}): Promise<Sale[]> =>
        api.get('/api/v1/sales/', { params }),

    obtenerPorVendedor: (vendedorId: number): Promise<Sale[]> =>
        api.get(`/api/v1/sales/seller/${vendedorId}`),
};

export const comisionesAPI = {
    obtenerReglas: (): Promise<CommissionRule[]> =>
        api.get('/api/v1/commissions/rules'),

    calcular: (filtroFechas: DateFilter): Promise<CommissionSumary> =>
        api.post('/api/v1/commissions/calculate', filtroFechas),

    obtenerPorVendedor: (vendedorId: number): Promise<SellerCommissionPercentage> =>
        api.get(`/api/v1/commissions/seller/${vendedorId}`),
};

export default api;