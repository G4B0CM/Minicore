// src/hooks/useUsuarios.ts
import { useEffect, useMemo, useState } from 'react';
import { comisionesAPI, usuariosAPI, ventasAPI } from '../services/backend';
import type { User, Sale, CommissionRule } from '../services/backend';

export type UsuarioVM = {
    usuario: User;
    ventas: Sale[];
    totalVentas: number;
    porcentajeComision: number;
    totalComision: number;
};

export function useUsuarios() {
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [ventas, setVentas] = useState<Sale[]>([]);
    const [reglas, setReglas] = useState<CommissionRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargar = async () => {
            try {
                const [usuariosRes, ventasRes, reglasRes] = await Promise.all([
                    usuariosAPI.obtenerTodos(),
                    ventasAPI.obtenerTodas(),
                    comisionesAPI.obtenerReglas()
                ]);
                setUsuarios(usuariosRes);
                setVentas(ventasRes);
                setReglas(reglasRes);
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos. Por favor, intente más tarde.');
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    const reglasOrdenadas = useMemo(
        () => [...reglas].sort((a, b) => b.min_amount - a.min_amount),
        [reglas]
    );

    const obtenerPorcentajeComision = (total: number) => {
        const r = reglasOrdenadas.find(regla => total >= regla.min_amount);
        return r ? r.percentage : 0;
    };

    const items: UsuarioVM[] = useMemo(() => {
        if (!usuarios.length) return [];
        return usuarios.map((u) => {
            const ventasDelVendedor = ventas
                .filter(v => v.seller_id === u.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const totalVentas = ventasDelVendedor.reduce((sum, v) => sum + v.amount, 0);
            const porcentajeComision = obtenerPorcentajeComision(totalVentas);
            const totalComision = totalVentas * porcentajeComision;

            return { usuario: u, ventas: ventasDelVendedor, totalVentas, porcentajeComision, totalComision };
        });
    }, [usuarios, ventas, reglasOrdenadas]);

    return { loading, error, items };
}
