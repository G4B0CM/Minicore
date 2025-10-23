
import { Message } from 'primereact/message';
import { Skeleton } from 'primereact/skeleton';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useHome } from '../hooks/useHome';

const HomePage: React.FC = () => {
    const { toast, dates, setDates, handleCalculateCommissions,
        loading, error, commissionData, salesChartData, chartOptions,
        sellerChartData, KpiCard, formatearMoneda
    } = useHome()

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

