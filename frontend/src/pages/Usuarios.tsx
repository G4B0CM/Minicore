// src/pages/Usuarios.tsx
import React from 'react';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import { useUsuarios } from '../hooks/useUsuarios';
import { UsuariosList } from '../components/UsuariosList';

const UsuariosPage: React.FC = () => {
    const { loading, error, items } = useUsuarios();

    if (loading) {
        return (
            <Card className="w-full">
                <Skeleton width="100%" height="150px" />
                <div className="mt-4"><Skeleton width="100%" height="400px" /></div>
            </Card>
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Detalle de Vendedores</h2>
            <p className="text-gray-600 mb-4">
                Desglose de ventas y cálculo de comisiones para cada miembro del equipo.
            </p>

            {error && <Message severity="error" text={error} className="mb-4 w-full" />}

            <UsuariosList items={items} />
        </div>
    );
};

export default UsuariosPage;
