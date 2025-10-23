import React, { useState } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { Toolbar } from 'primereact/toolbar';
import { TabView, TabPanel } from 'primereact/tabview';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
//Páginas
import HomePage from './pages/Home';
import UsuariosPage from './pages/Usuarios';
import VentasPage from './pages/Ventas';

const App: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const startContent = (
    <div className="flex align-items-center gap-2">
      <i className="pi pi-calculator text-2xl"></i>
      <span className="font-bold text-xl">Sistema de Comisiones</span>
    </div>
  );

  return (
    <PrimeReactProvider>
      <div className="min-h-screen bg-gray-100 ">
        <Toolbar start={startContent} className="border-round-none shadow-2 " />

        <div className="p-4 w-full">
          <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
            <TabPanel header="Inicio" leftIcon="pi pi-home">
              <HomePage />
            </TabPanel>
            <TabPanel header="Vendedores" leftIcon="pi pi-users">
              <UsuariosPage />
            </TabPanel>
            <TabPanel header="Ventas" leftIcon="pi pi-shopping-cart">
              <VentasPage />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </PrimeReactProvider>
  );
};

export default App;

