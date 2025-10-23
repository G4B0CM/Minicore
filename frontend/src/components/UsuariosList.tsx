// src/components/UsuariosList.tsx
import React from 'react';
import type { UsuarioVM } from '../hooks/useUsuarios';
import { Card } from 'primereact/card';
import { Fieldset } from 'primereact/fieldset';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Props = {
    items: UsuarioVM[];
};

const formatearMoneda = (v: number) =>
    new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(v || 0);

const formatearFecha = (fecha: string) =>
    format(new Date(`${fecha}T00:00:00`), 'dd/MM/yyyy', { locale: es });

export const UsuariosList: React.FC<Props> = ({ items }) => {
    return (
        <div className="w-full">
            {items.map(({ usuario, ventas, totalVentas, porcentajeComision, totalComision }) => {
                const leyenda = <span className="font-bold text-xl">{usuario.name}</span>;

                return (
                    <Fieldset key={usuario.id} legend={leyenda} toggleable className="mb-4 w-full">
                        {/* KPIs */}
                        <div className="grid text-center mb-4">
                            <div className="col-12 md:col-4">
                                <Card>
                                    <div className="text-gray-500 font-medium mb-1">Total Vendido</div>
                                    <div className="text-2xl font-bold text-green-600">{formatearMoneda(totalVentas)}</div>
                                </Card>
                            </div>
                            <div className="col-12 md:col-4">
                                <Card>
                                    <div className="text-gray-500 font-medium mb-1">% Comisión</div>
                                    <div className="text-2xl font-bold text-blue-600">{(porcentajeComision * 100).toFixed(1)}%</div>
                                </Card>
                            </div>
                            <div className="col-12 md:col-4">
                                <Card>
                                    <div className="text-gray-500 font-medium mb-1">Comisión Generada</div>
                                    <div className="text-2xl font-bold text-purple-600">{formatearMoneda(totalComision)}</div>
                                </Card>
                            </div>
                        </div>

                        {/* Tabla de ventas del vendedor */}
                        <DataTable
                            value={ventas}
                            emptyMessage="Este vendedor no tiene ventas."
                            size="small"
                            stripedRows
                            className="w-full"
                            style={{ width: '100%' }}
                        >
                            <Column
                                field="date"
                                header="Fecha"
                                sortable
                                body={(venta) => formatearFecha(venta.date)}
                            />
                            <Column
                                field="amount"
                                header="Monto"
                                sortable
                                align="right"
                                body={(venta) => formatearMoneda(venta.amount)}
                            />
                            <Column
                                header="Categoría"
                                align="center"
                                body={(venta) => {
                                    const severity = venta.amount >= 500 ? 'success' : venta.amount >= 300 ? 'warning' : 'info';
                                    const value = venta.amount >= 500 ? 'Alta' : venta.amount >= 300 ? 'Media' : 'Baja';
                                    return <Tag severity={severity} value={value} />;
                                }}
                            />
                        </DataTable>
                    </Fieldset>
                );
            })}
        </div>
    );
};
