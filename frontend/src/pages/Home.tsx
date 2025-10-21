import React, { useState, useEffect } from 'react';

// Importaciones de PrimeReact
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// Interfaz para la data de la tabla
interface RecentSale {
    id: number;
    seller: string;
    product: string;
    amount: number;
    date: string;
}

const HomePage: React.FC = () => {
    // --- Estados para los Gráficos ---
    const [salesChartData, setSalesChartData] = useState({});
    const [sellerChartData, setSellerChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    // --- Mock Data para la Tabla ---
    const recentSales: RecentSale[] = [
        { id: 101, seller: 'Ana Torres', product: 'Producto A', amount: 150.75, date: '2024-10-20' },
        { id: 102, seller: 'Carlos Ruiz', product: 'Producto B', amount: 200.00, date: '2024-10-20' },
        { id: 103, seller: 'Ana Torres', product: 'Producto C', amount: 99.50, date: '2024-10-19' },
        { id: 104, seller: 'Lucía Fernandez', product: 'Producto A', amount: 310.20, date: '2024-10-19' },
        { id: 105, seller: 'Carlos Ruiz', product: 'Producto D', amount: 55.00, date: '2024-10-18' },
    ];

    // --- Cargar datos de los gráficos al montar el componente ---
    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dee2e6';

        // Data para el gráfico de barras (Ventas por Mes)
        setSalesChartData({
            labels: ['Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre'],
            datasets: [
                {
                    label: 'Ventas Totales',
                    data: [6500, 5900, 8000, 8100, 9200],
                    backgroundColor: 'rgba(59, 130, 246, 0.7)', // Azul de PrimeReact
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }
            ]
        });

        // Data para el gráfico de dona (Ventas por Vendedor)
        setSellerChartData({
            labels: ['Ana Torres', 'Carlos Ruiz', 'Lucía Fernandez'],
            datasets: [
                {
                    data: [45, 30, 25],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.7)',  // Rojo
                        'rgba(59, 130, 246, 0.7)', // Azul
                        'rgba(34, 197, 94, 0.7)',  // Verde
                    ],
                    hoverBackgroundColor: [
                        'rgb(239, 68, 68)',
                        'rgb(59, 130, 246)',
                        'rgb(34, 197, 94)',
                    ]
                }
            ]
        });

        // Opciones comunes para los gráficos
        setChartOptions({
            plugins: {
                legend: {
                    labels: { color: textColor }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder }
                },
                x: {
                    ticks: { color: textColorSecondary },
                    grid: { color: surfaceBorder, display: false }
                }
            }
        });
    }, []);

    // --- Templates para la DataTable ---
    const amountBodyTemplate = (rowData: RecentSale) => {
        return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(rowData.amount);
    };

    // Componente para las tarjetas de KPIs
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
            <h2 className="text-3xl font-bold text-gray-800 mb-5">Panel de Control</h2>

            {/* --- KPIs / Indicadores Principales --- */}
            <div className="grid mb-5">
                <div className="col-12 md:col-6 lg:col-4">
                    <KpiCard title="Ingresos" value="$9,200.50" icon="pi pi-dollar" colorClass="bg-blue-100 text-blue-500" />
                </div>
                <div className="col-12 md:col-6 lg:col-4">
                    <KpiCard title="Operaciones" value="152" icon="pi pi-shopping-cart" colorClass="bg-green-100 text-green-500" />
                </div>
                <div className="col-12 md:col-6 lg:col-4">
                    <KpiCard title="Equipo" value="3" icon="pi pi-users" colorClass="bg-purple-100 text-purple-500" />
                </div>
            </div>

            {/* --- Gráficos --- */}
            <div className="grid mb-5">
                <div className="col-12 lg:col-8">
                    <Card title="Rendimiento de Ventas Mensuales">
                        <Chart type="bar" data={salesChartData} options={chartOptions} />
                    </Card>
                </div>
                <div className="col-12 lg:col-4">
                    <Card title="Distribución por Vendedor">
                        <Chart type="doughnut" data={sellerChartData} options={{ ...chartOptions, cutout: '60%' }} />
                    </Card>
                </div>
            </div>

            {/* --- Tabla de Datos --- */}
            <div className="grid">
                <div className="col-12">
                    <Card title="Ventas Recientes">
                        <DataTable
                            value={recentSales}
                            paginator
                            rows={5}
                            stripedRows
                            removableSort
                            emptyMessage="No se encontraron ventas."
                        >
                            <Column field="id" header="ID Venta" sortable />
                            <Column field="seller" header="Vendedor" sortable />
                            <Column field="product" header="Producto" />
                            <Column field="amount" header="Monto" body={amountBodyTemplate} sortable />
                            <Column field="date" header="Fecha" sortable />
                        </DataTable>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

