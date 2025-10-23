// src/components/VentasTable.tsx
import React from 'react';
import type { Sale } from '../services/backend';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import type {
    DataTableFilterMeta,
    DataTableFilterMetaData
} from 'primereact/datatable';

import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type VendedorOption = { label: string; value: string };

type Props = {
    ventas: Sale[];
    filters: DataTableFilterMeta;
    globalFilterValue: string;
    vendedorOptions: VendedorOption[];
    onGlobalFilterChange: (value: string) => void;
    onSellerFilterChange: (value: string | null) => void;
};

const formatearMoneda = (valor: number) =>
    new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(valor);

const formatearFecha = (fecha: string) =>
    format(new Date(`${fecha}T00:00:00`), 'dd/MM/yyyy', { locale: es });

export const VentasTable: React.FC<Props> = ({
    ventas,
    filters,
    globalFilterValue,
    vendedorOptions,
    onGlobalFilterChange,
    onSellerFilterChange
}) => {
    // Lee valor del filtro de vendedor sin warnings de tipos
    const sellerFilterValue =
        (filters['seller_name'] as DataTableFilterMetaData | undefined)?.value ?? null;

    const header = (
        <div className="flex justify-content-between align-items-center gap-3">
            <Dropdown
                value={sellerFilterValue}
                options={vendedorOptions}
                onChange={(e: DropdownChangeEvent) => onSellerFilterChange(e.value ?? null)}
                placeholder="Filtrar por vendedor"
                showClear
                className="p-column-filter"
            />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    value={globalFilterValue}
                    onChange={(e) => onGlobalFilterChange(e.target.value)}
                    placeholder="Buscar en tabla..."
                />
            </span>
        </div>
    );

    return (
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
            header={header}
            emptyMessage="No se encontraron ventas que coincidan."
        >
            <Column field="id" header="ID" sortable />
            <Column field="date" header="Fecha" body={(r: Sale) => formatearFecha(r.date)} sortable />
            <Column field="seller_name" header="Vendedor" sortable />
            <Column
                field="amount"
                header="Monto"
                body={(r: Sale) => <span className="font-bold text-green-600">{formatearMoneda(r.amount)}</span>}
                align="right"
                sortable
            />
        </DataTable>
    );
};
