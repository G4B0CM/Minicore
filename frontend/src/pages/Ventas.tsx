// src/pages/Ventas.tsx
import React from 'react';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Skeleton } from 'primereact/skeleton';

import { useVentas } from '../hooks/useVentas';
import { VentasTable } from '../components/VentasTable';

const VentasPage: React.FC = () => {
    const {
        loading,
        error,
        ventas,
        filters,
        vendedorOptions,
        globalFilterValue,
        updateGlobalFilter,
        updateSellerFilter
    } = useVentas();

    if (loading) {
        return (
            <div className="w-full">
                <Card className="w-full">
                    <Skeleton width="100%" height="500px" />
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Card className="w-full">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Ventas</h2>
                <p className="text-gray-600 mb-4">
                    Consulta, filtra y busca en el historial de ventas.
                </p>

                {error && <Message severity="error" text={error} className="mb-4 w-full" />}

                <VentasTable
                    ventas={ventas}
                    filters={filters}
                    globalFilterValue={globalFilterValue}
                    vendedorOptions={vendedorOptions}
                    onGlobalFilterChange={updateGlobalFilter}
                    onSellerFilterChange={updateSellerFilter}
                />
            </Card>
        </div>
    );
};

export default VentasPage;
