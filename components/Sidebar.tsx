import React, { useState } from 'react';
import { OrdersIcon, PriceIcon, ClientsIcon, LogisticsIcon, StaffIcon, ChevronLeftIcon, BoxIcon, SettingsIcon, ChevronDownIcon, KanbanIcon } from './icons/Icons';
import { View } from '../lib/types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const navItems: { name: View; icon: React.ReactNode; }[] = [
  { name: 'Kanban', icon: <KanbanIcon /> },
  { name: 'Pedidos', icon: <OrdersIcon /> },
  { name: 'Precios', icon: <PriceIcon /> },
  { name: 'Clientes', icon: <ClientsIcon /> },
  { name: 'Logística', icon: <LogisticsIcon /> },
  { name: 'Personal', icon: <StaffIcon /> },
];

const configItems: { name: View; label: string; }[] = [
  { name: 'Configuración-Perfil', label: 'Perfil' },
  { name: 'Configuración-Estatus', label: 'Estatus' },
  { name: 'Configuración-Turnos', label: 'Turnos' },
  { name: 'Configuración-Sucursal', label: 'Sucursal' },
  { name: 'Configuración-Formas de Pago', label: 'Formas de Pago' },
  { name: 'Configuración-Reparto', label: 'Reparto' },
  { name: 'Configuración-Zonas', label: 'Zonas' },
  { name: 'Configuración-Clientes', label: 'Clientes' },
  { name: 'Configuración-Productos', label: 'Productos' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isCollapsed, toggleSidebar }) => {
  const [isConfigOpen, setConfigOpen] = useState(activeView.startsWith('Configuración-'));

  return (
    <div
      className={`relative flex flex-col bg-white text-gray-700 border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200">
        <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center w-full' : ''}`}>
           <BoxIcon />
           {!isCollapsed && <h1 className="text-xl font-bold text-gray-800">Panel</h1>}
        </div>
        <button 
          onClick={toggleSidebar} 
          className="absolute -right-3 top-7 p-1 bg-primary text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary z-10"
          aria-label={isCollapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
        >
          <ChevronLeftIcon className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} />
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.name;
          return (
            <button
              key={item.name}
              onClick={() => {
                setActiveView(item.name);
                setConfigOpen(false);
              }}
              className={`w-full text-left flex items-center px-4 py-3 transition-colors duration-200 transform rounded-md relative ${
                isActive
                  ? 'bg-indigo-50 text-primary'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={item.name}
            >
              {isActive && <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"></span>}
              {item.icon}
              {!isCollapsed && <span className="mx-4 font-medium">{item.name}</span>}
            </button>
          );
        })}
        
        {/* Configuración Dropdown */}
        <div className="pt-2">
           <button
              onClick={() => setConfigOpen(!isConfigOpen)}
              className={`w-full text-left flex items-center justify-between px-4 py-3 transition-colors duration-200 transform rounded-md ${
                 activeView.startsWith('Configuración-') ? 'bg-indigo-50 text-primary' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title="Configuración"
            >
              <div className="flex items-center">
                <SettingsIcon />
                {!isCollapsed && <span className="mx-4 font-medium">Configuración</span>}
              </div>
              {!isCollapsed && (
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isConfigOpen ? 'rotate-180' : ''}`} />
              )}
            </button>
            {isConfigOpen && !isCollapsed && (
                <div className="py-2 pl-8 pr-2 space-y-1 bg-gray-50">
                    {configItems.map(item => {
                        const isActive = activeView === item.name;
                        return (
                           <button
                               key={item.name}
                               onClick={() => setActiveView(item.name)}
                               className={`w-full text-left block px-4 py-2 text-sm rounded-md ${isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                           >
                               {item.label}
                           </button>
                       );
                    })}
                </div>
            )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;