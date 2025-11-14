
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PedidosTable from './components/PedidosTable';
import PreciosTable from './components/PreciosTable';
import ClientesTable from './components/ClientesTable';
import LogisticaTable from './components/LogisticaTable';
import PersonalTable from './components/PersonalTable';
import { View, Pedido, EstatusConfig } from './lib/types';
import { initialPedidos, initialEstatusConfig } from './lib/data';

// Importar el nuevo componente Kanban
import KanbanBoard from './components/KanbanBoard';

// Importar los nuevos componentes de configuración
import EstatusPage from './components/configuracion/EstatusPage';
import TurnosPage from './components/configuracion/TurnosPage';
import SucursalPage from './components/configuracion/SucursalPage';
import FormasDePagoPage from './components/configuracion/FormasDePagoPage';
import RepartoPage from './components/configuracion/RepartoPage';
import ZonasPage from './components/configuracion/ZonasPage';
import ClientesConfigPage from './components/configuracion/ClientesConfigPage';
import ProductosPage from './components/configuracion/ProductosPage';
import PerfilPage from './components/configuracion/PerfilPage';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('Pedidos');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Centralized state
  const [pedidos, setPedidos] = useState<Pedido[]>(initialPedidos);
  const [estatuses, setEstatuses] = useState<EstatusConfig[]>(initialEstatusConfig);
  const [isSelectOpen, setIsSelectOpen] = useState(false);


  const renderContent = () => {
    switch (activeView) {
      case 'Kanban': return <KanbanBoard estatusConfig={estatuses} pedidos={pedidos} setPedidos={setPedidos} />;
      case 'Pedidos': return <PedidosTable pedidos={pedidos} setPedidos={setPedidos} setIsSelectOpen={setIsSelectOpen} />;
      case 'Precios': return <PreciosTable setIsSelectOpen={setIsSelectOpen} />;
      case 'Clientes': return <ClientesTable setIsSelectOpen={setIsSelectOpen}/>;
      case 'Logística': return <LogisticaTable setIsSelectOpen={setIsSelectOpen}/>;
      case 'Personal': return <PersonalTable setIsSelectOpen={setIsSelectOpen}/>;
      // Vistas de Configuración
      case 'Configuración-Estatus': return <EstatusPage estatuses={estatuses} setEstatuses={setEstatuses} pedidos={pedidos} setPedidos={setPedidos} />;
      case 'Configuración-Turnos': return <TurnosPage />;
      case 'Configuración-Sucursal': return <SucursalPage />;
      case 'Configuración-Formas de Pago': return <FormasDePagoPage />;
      case 'Configuración-Reparto': return <RepartoPage />;
      case 'Configuración-Zonas': return <ZonasPage />;
      case 'Configuración-Clientes': return <ClientesConfigPage />;
      case 'Configuración-Productos': return <ProductosPage />;
      case 'Configuración-Perfil': return <PerfilPage />;
      default: return <PedidosTable pedidos={pedidos} setPedidos={setPedidos} setIsSelectOpen={setIsSelectOpen}/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main className="flex-1 flex flex-col transition-all duration-300">
        <div className={`flex-1 ${isSelectOpen ? 'overflow-visible' : 'overflow-y-auto overflow-x-hidden'}`}>
          <div className="container mx-auto px-6 py-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;