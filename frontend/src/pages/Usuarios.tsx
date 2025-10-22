import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Tipos y API
import { comisionesAPI, usuariosAPI, ventasAPI } from '../services/backend';
import type { User, Sale, CommissionRule } from '../services/backend';

// Componentes de PrimeReact
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Message } from 'primereact/message';
import { Fieldset } from 'primereact/fieldset';
import { Skeleton } from 'primereact/skeleton';

const UsuariosPage: React.FC = () => {
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [ventas, setVentas] = useState<Sale[]>([]);
    const [reglas, setReglas] = useState<CommissionRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // MEJORA: Obtenemos las reglas de comisión desde la API
                const [usuariosRes, ventasRes, reglasRes] = await Promise.all([
                    usuariosAPI.obtenerTodos(),
                    ventasAPI.obtenerTodas(),
                    comisionesAPI.obtenerReglas()
                ]);
                setUsuarios(usuariosRes);
                setVentas(ventasRes);
                // Ordenamos las reglas de mayor a menor para facilitar el cálculo
                setReglas(reglasRes.sort((a, b) => b.min_amount - a.min_amount));
            } catch (err) {
                setError('Error al cargar los datos. Por favor, intente más tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, []);

    const formatearMoneda = (valor: number): string => {
        return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(valor || 0);
    };

    const formatearFecha = (fecha: string): string => {
        // Añadimos la hora para evitar problemas de zona horaria con new Date()
        return format(new Date(`${fecha}T00:00:00`), 'dd/MM/yyyy', { locale: es });
    };

    // MEJORA: El cálculo ahora se basa en las reglas traídas de la API
    const obtenerPorcentajeComision = (totalVentas: number): number => {
        const reglaAplicable = reglas.find(regla => totalVentas >= regla.min_amount);
        return reglaAplicable ? reglaAplicable.percentage : 0;
    };

    // --- Templates para el DataTable ---
    const fechaBodyTemplate = (venta: Sale) => formatearFecha(venta.date);
    const montoBodyTemplate = (venta: Sale) => formatearMoneda(venta.amount);
    const estadoBodyTemplate = (venta: Sale) => {
        const severity = venta.amount >= 500 ? 'success' : venta.amount >= 300 ? 'warning' : 'info';
        const value = venta.amount >= 500 ? 'Alta' : venta.amount >= 300 ? 'Media' : 'Baja';
        return <Tag severity={severity} value={value} />;
    };

    if (loading) {
        return <Card><Skeleton width="100%" height="150px" /><div className="mt-4"><Skeleton width="100%" height="400px" /></div></Card>;
    }

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Detalle de Vendedores</h2>
            <p className="text-gray-600 mb-4">
                Desglose de ventas y cálculo de comisiones para cada miembro del equipo.
            </p>

            {error && <Message severity="error" text={error} className="mb-4 w-full" />}

            {usuarios.map((usuario) => {
                const ventasDelVendedor = ventas
                    .filter(venta => venta.seller_id === usuario.id)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                const totalVentas = ventasDelVendedor.reduce((sum, venta) => sum + venta.amount, 0);
                const porcentajeComision = obtenerPorcentajeComision(totalVentas);
                const totalComision = totalVentas * porcentajeComision;

                const leyendaVendedor = <span className="font-bold text-xl">{usuario.name}</span>;

                return (
                    <Fieldset key={usuario.id} legend={leyendaVendedor} toggleable className="mb-4 w-full">
                        {/* Resumen de KPIs del vendedor */}
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
                            value={ventasDelVendedor}
                            emptyMessage="Este vendedor no tiene ventas."
                            size="small"
                            stripedRows
                            className="w-full"
                            style={{ width: '100%' }}>
                            <Column field="date" header="Fecha" body={fechaBodyTemplate} sortable />
                            <Column field="amount" header="Monto" body={montoBodyTemplate} align="right" sortable />
                            <Column header="Categoría" body={estadoBodyTemplate} align="center" />
                        </DataTable>
                    </Fieldset>
                );
            })}
        </div>
    );
};

export default UsuariosPage;

