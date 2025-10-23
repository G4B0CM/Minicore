// src/hooks/useVentas.ts
import { useEffect, useMemo, useState } from 'react';
import { ventasAPI, usuariosAPI } from '../services/backend';
import type { Sale, User } from '../services/backend';

import type {
    DataTableFilterMeta,
    DataTableFilterMetaData
} from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';

export type VendedorOption = { label: string; value: string };

export function useVentas() {
    const [ventas, setVentas] = useState<Sale[]>([]);
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filtros (forzamos formato “single” para evitar la unión con operator meta)
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: {
            value: null,
            matchMode: FilterMatchMode.CONTAINS
        } as DataTableFilterMetaData,
        seller_name: {
            value: null,
            matchMode: FilterMatchMode.EQUALS
        } as DataTableFilterMetaData
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [ventasRes, usuariosRes] = await Promise.all([
                    ventasAPI.obtenerTodas(),
                    usuariosAPI.obtenerTodos()
                ]);
                setVentas(ventasRes);
                setUsuarios(usuariosRes);
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos. Por favor, recargue la página.');
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    // Opciones para el dropdown de vendedor
    const vendedorOptions: VendedorOption[] = useMemo(
        () => usuarios.map(u => ({ label: u.name, value: u.name })),
        [usuarios]
    );

    // Helpers de actualización (tipados y sin warnings)
    const updateGlobalFilter = (value: string) => {
        setGlobalFilterValue(value);
        setFilters(prev => ({
            ...prev,
            global: {
                value,
                matchMode: FilterMatchMode.CONTAINS
            } as DataTableFilterMetaData
        }));
    };

    const updateSellerFilter = (value: string | null) => {
        setFilters(prev => ({
            ...prev,
            seller_name: {
                value,
                matchMode: FilterMatchMode.EQUALS
            } as DataTableFilterMetaData
        }));
    };

    return {
        loading,
        error,
        ventas,
        filters,
        setFilters, // por si necesitas algo avanzado
        vendedorOptions,
        globalFilterValue,
        updateGlobalFilter,
        updateSellerFilter
    };
}
