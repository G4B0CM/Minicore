// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import "primereact/resources/themes/lara-light-indigo/theme.css";
// 2. Estilos base de PrimeReact (IMPORTANTE)
import "primereact/resources/primereact.min.css";
// 3. Iconos de PrimeIcons (IMPORTANTE)
import "primeicons/primeicons.css";
// 4. Utilidades de layout de PrimeFlex (IMPORTANTE)
import 'primeflex/primeflex.css';
// 5. Estilos globales que puedas tener (opcional)
import './index.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className='flex aling-items-center justify-content-center'>

      <App />
    </div>
  </React.StrictMode>,
);