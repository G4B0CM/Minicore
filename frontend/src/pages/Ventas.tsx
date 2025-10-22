import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Tipos y API
import { ventasAPI, usuariosAPI } from '../services/backend';
import type { Sale, User } from '../services/backend';

// Componentes de PrimeReact
import { DataTable, type DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';
import { FilterMatchMode } from 'primereact/api';

const VentasPage: React.FC = () => {
    const [ventas, setVentas] = useState<Sale[]>([]);
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Estados para los filtros ---
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        seller_name: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

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
                setError('Error al cargar los datos. Por favor, recargue la página.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters = { ...filters } as DataTableFilterMeta;
        // Reasignamos el objeto para evitar acceder a `.value` de una unión
        _filters['global'] = { value, matchMode: FilterMatchMode.CONTAINS } as any;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onSellerFilterChange = (e: DropdownChangeEvent) => {
        const value = e.value;
        const _filters = { ...filters } as DataTableFilterMeta;
        // Reasignamos para evitar mutar `.value` directamente en la unión
        _filters['seller_name'] = { value, matchMode: FilterMatchMode.EQUALS } as any;
        setFilters(_filters);
    };

    // --- Templates para el DataTable ---
    const formatearMoneda = (valor: number): string => {
        return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(valor);
    };

    const formatearFecha = (fecha: string): string => {
        // Asegura que la fecha se interprete correctamente como UTC
        return format(new Date(`${fecha}T00:00:00`), 'dd/MM/yyyy', { locale: es });
    };

    const fechaBodyTemplate = (rowData: Sale) => formatearFecha(rowData.date);
    const montoBodyTemplate = (rowData: Sale) => (
        <span className="font-bold text-green-600">{formatearMoneda(rowData.amount)}</span>
    );

    const vendedorOptions = usuarios.map(u => ({ label: u.name, value: u.name }));

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between align-items-center gap-3">
                <Dropdown
                    value={(filters['seller_name'] as any)?.value}
                    options={vendedorOptions}
                    onChange={onSellerFilterChange}
                    placeholder="Filtrar por vendedor"
                    showClear
                    className="p-column-filter"

                />
                <span className="p-input-icon-left">
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar en tabla..." />
                </span>
            </div>
        );
    };

    if (loading) {
        return <Card><Skeleton width="100%" height="500px" /></Card>;
    }

    return (
        <div className="w-full">
            <Card className="w-full">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Ventas</h2>
                <p className="text-gray-600 mb-4">
                    Consulta, filtra y busca en el historial de ventas.
                </p>

                {error && <Message severity="error" text={error} className="mb-4 w-full" />}

                <DataTable
                    className="w-full"
                    style={{ width: '100%' }}
                    value={ventas}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    stripedRows
                    removableSort
                    filters={filters}
                    globalFilterFields={['id', 'seller_name', 'amount', 'date']}
                    header={renderHeader()}
                    emptyMessage="No se encontraron ventas que coincidan."
                >
                    <Column field="id" header="ID" sortable />
                    <Column field="date" header="Fecha" body={fechaBodyTemplate} sortable />
                    <Column field="seller_name" header="Vendedor" sortable />
                    <Column field="amount" header="Monto" body={montoBodyTemplate} align="right" sortable />
                </DataTable>
            </Card>
        </div>
    );
};

export default VentasPage;

