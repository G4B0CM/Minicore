import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';

// API y Tipos
import { comisionesAPI } from '../services/backend';
import type { CommissionSumary } from '../services/backend';

// Componentes de PrimeReact
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';

export const useHome = () => {
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
    const formatMoney = (valor: number) => new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(valor);
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


    return {
        //atributes
        toast,
        dates,
        loading,
        error,
        commissionData,
        salesChartData,
        chartOptions,
        sellerChartData,

        //methods
        setDates,
        handleCalculateCommissions,
        formatMoney,

        //components
        KpiCard
    }
}
