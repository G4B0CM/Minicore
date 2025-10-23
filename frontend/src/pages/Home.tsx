
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useHome } from '../hooks/useHome';
import { HomeCard } from '../components/HomeCard';

const HomePage: React.FC = () => {
    const { toast, dates, setDates, handleCalculateCommissions,
        loading, error, commissionData, salesChartData, chartOptions,
        sellerChartData, KpiCard, formatMoney
    } = useHome()

    return (
        <div>
            <Toast ref={toast} />
            <h2 className="text-3xl font-bold text-gray-800 mb-5">Panel de Control</h2>

            {/* --- SECCIÓN DE CÁLCULO DE COMISIONES --- */}
            <HomeCard dates={dates} setDates={setDates} handleCalculateCommissions={handleCalculateCommissions}
                loading={loading} error={error} commissionData={commissionData} formatMoney={formatMoney} />

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

