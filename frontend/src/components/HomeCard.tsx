import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Message } from 'primereact/message'
import { Skeleton } from 'primereact/skeleton'
import type { Dispatch, SetStateAction } from 'react'
import type { CommissionSumary } from '../services/backend'

interface Props {
    dates: Date[] | null;
    setDates: Dispatch<SetStateAction<Date[] | null>>;
    handleCalculateCommissions: () => Promise<void>;
    loading: boolean;
    error: string | null;
    commissionData: CommissionSumary | null;
    formatMoney: (valor: number) => string;
}

export const HomeCard = ({ dates, setDates, handleCalculateCommissions, loading, error, commissionData, formatMoney }: Props) => {
    return (
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
                                <div className="text-green-600 font-bold text-2xl">{formatMoney(commissionData.total_sales)}</div>
                            </Card>
                        </div>
                        <div className="col-12 md:col-6">
                            <Card>
                                <div className="text-500 font-medium mb-2">Comisiones Totales a Pagar</div>
                                <div className="text-blue-600 font-bold text-2xl">{formatMoney(commissionData.total_commissions)}</div>
                            </Card>
                        </div>
                    </div>
                    <DataTable value={commissionData.commissions} stripedRows>
                        <Column field="seller_name" header="Vendedor" />
                        <Column field="total_sales" header="Total Vendido" body={(data) => formatMoney(data.total_sales)} />
                        <Column field="commission_percentage" header="% Comisión" body={(data) => `${(data.commission_percentage * 100).toFixed(2)}%`} />
                        <Column field="total_commission" header="Comisión a Pagar" body={(data) => formatMoney(data.total_commission)} />
                    </DataTable>
                </div>
            )}
        </Card>
    )
}
