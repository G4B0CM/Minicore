import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';

// API y Tipos
import { comisionesAPI } from '../services/backend';
import type { CommissionSumary } from '../services/backend';

// Componentes de PrimeReact
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { Skeleton } from 'primereact/skeleton';

const HomePage: React.FC = () => {
    // --- Estados para el cálculo de comisiones ---
    const [dates, setDates] = useState<Date[] | null>(null);
    const [commissionData, setCommissionData] = useState<CommissionSumary | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const toast = useRef<Toast>(null);

    // --- Estados para los gráficos (datos de demostración) ---
    const [salesChartData, setSalesChartData] = useState({});
    const [sellerChartData, setSellerChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        // Lógica para inicializar los gráficos de demostración
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dee2e6';

        setSalesChartData({
            labels: ['Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre'],
            datasets: [{
                label: 'Ventas Totales',
                data: [6500, 5900, 8000, 8100, 9200],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
            }]
        });

        setSellerChartData({
            labels: ['Ana Torres', 'Carlos Ruiz', 'Lucía Fernandez'],
            datasets: [{
                data: [45, 30, 25],
                backgroundColor: ['rgba(239, 68, 68, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(34, 197, 94, 0.7)'],
            }]
        });

        setChartOptions({
            plugins: { legend: { labels: { color: textColor } } },
            scales: {
                y: { beginAtZero: true, ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
                x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, display: false } }
            }
        });
    }, []);

    // --- Lógica para el cálculo de comisiones ---
    const handleCalculateCommissions = async () => {
        const startDate = dates?.[0];
        const endDate = dates?.[1];

        if (!startDate || !endDate) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Debes seleccionar una fecha de inicio y una de fin.' });
            return;
        }
        if (startDate > endDate) {
            toast.current?.show({ severity: 'error', summary: 'Error de Fechas', detail: 'La fecha de inicio no puede ser posterior a la fecha de fin.' });
            return;
        }

        setLoading(true);
        setError(null);
        setCommissionData(null);

        try {
            // 2. Formateo y llamada a la API
            const dateFilter = {
                start_date: format(startDate, 'yyyy-MM-dd'),
                end_date: format(endDate, 'yyyy-MM-dd'),
            };
            const result = await comisionesAPI.calcular(dateFilter);

            // 3. Actualización del estado
            setCommissionData(result);
            toast.current?.show({ severity: 'success', summary: 'Cálculo Exitoso', detail: `Se calcularon las comisiones para el período: ${result.period}` });
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ocurrió un error al calcular las comisiones.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- Templates y formateadores ---
    const formatearMoneda = (valor: number) => new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(valor);
    const KpiCard = ({ title, value, icon, colorClass }: { title: string; value: string; icon: string; colorClass: string; }) => (
        <Card>
            <div className="flex justify-content-between">
                <div>
                    <span className="block text-500 font-medium mb-3">{title}</span>
                    <div className="text-900 font-bold text-xl">{value}</div>
                </div>
                <div className={`flex align-items-center justify-content-center border-round ${colorClass}`} style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className={`${icon} text-xl`}></i>
                </div>
            </div>
        </Card>
    );

    return (
        <div>
            <Toast ref={toast} />
            <h2 className="text-3xl font-bold text-gray-800 mb-5">Panel de Control</h2>

            {/* --- SECCIÓN DE CÁLCULO DE COMISIONES --- */}
            <Card title="Calcular Comisiones por Período" className="mb-5">
                <div className="grid align-items-center gap-3">
                    <div className="col-12 md:col-4">
                        <label htmlFor="range-calendar" className="font-bold block mb-2">Rango de Fechas</label>
                        <Calendar
                            id="range-calendar"
                            value={dates}
                            onChange={(e) => setDates((e.value as Date[] | null) ?? null)}
                            selectionMode="range"
                            readOnlyInput
                            dateFormat="dd/mm/yy"
                            className="w-full pb-10"
                        />
                    </div>
                    <div className="col-12 md:col-3">
                        <Button
                            label="Calcular Comisiones"
                            icon="pi pi-calculator"
                            onClick={handleCalculateCommissions}
                            loading={loading}
                            disabled={!dates?.[0] || !dates?.[1]}
                            className="w-full mt-4"
                        />
                    </div>
                </div>

                {/* --- Visualización de Resultados --- */}
                {loading && <Skeleton width="100%" height="200px" className="mt-4" />}
                {error && <Message severity="error" text={error} className="mt-4 w-full" />}
                {commissionData && !loading && (
                    <div className="mt-5">
                        <h3 className="text-2xl font-bold text-gray-700">Resumen del Período: {commissionData.period}</h3>
                        <div className="grid text-center my-4">
                            <div className="col-12 md:col-6">
                                <Card>
                                    <div className="text-500 font-medium mb-2">Ventas Totales del Período</div>
                                    <div className="text-green-600 font-bold text-2xl">{formatearMoneda(commissionData.total_sales)}</div>
                                </Card>
                            </div>
                            <div className="col-12 md:col-6">
                                <Card>
                                    <div className="text-500 font-medium mb-2">Comisiones Totales a Pagar</div>
                                    <div className="text-blue-600 font-bold text-2xl">{formatearMoneda(commissionData.total_commissions)}</div>
                                </Card>
                            </div>
                        </div>
                        <DataTable value={commissionData.commissions} stripedRows>
                            <Column field="seller_name" header="Vendedor" />
                            <Column field="total_sales" header="Total Vendido" body={(data) => formatearMoneda(data.total_sales)} />
                            <Column field="commission_percentage" header="% Comisión" body={(data) => `${(data.commission_percentage * 100).toFixed(2)}%`} />
                            <Column field="total_commission" header="Comisión a Pagar" body={(data) => formatearMoneda(data.total_commission)} />
                        </DataTable>
                    </div>
                )}
            </Card>

            {/* --- KPIs / Indicadores y Gráficos (Datos de Demostración) --- */}
            <div className="grid mb-5">
                <div className="col-12 md:col-6 lg:col-4">
                    <KpiCard title="Ingresos (Demo)" value="$9,200.50" icon="pi pi-dollar" colorClass="bg-blue-100 text-blue-500" />
                </div>
                <div className="col-12 md:col-6 lg:col-4">
                    <KpiCard title="Operaciones (Demo)" value="152" icon="pi pi-shopping-cart" colorClass="bg-green-100 text-green-500" />
                </div>
                <div className="col-12 md:col-6 lg:col-4">
                    <KpiCard title="Equipo (Demo)" value="3" icon="pi pi-users" colorClass="bg-purple-100 text-purple-500" />
                </div>
            </div>

            <div className="grid">
                <div className="col-12 lg:col-8">
                    <Card title="Rendimiento de Ventas Mensuales (Demo)">
                        <Chart type="bar" data={salesChartData} options={chartOptions} />
                    </Card>
                </div>
                <div className="col-12 lg:col-4">
                    <Card title="Distribución por Vendedor (Demo)">
                        <Chart type="doughnut" data={sellerChartData} options={{ ...chartOptions, cutout: '60%' }} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

