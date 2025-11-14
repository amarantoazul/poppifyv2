import React, { useState } from 'react';
import { Pedido, EstatusPedido, EstatusConfig } from '../lib/types';
import { ClockIcon, SettingsIcon, PaperAirplaneIcon, GiftIcon, SadFaceIcon, ReplyIcon } from './icons/Icons';

interface KanbanBoardProps {
    estatusConfig: EstatusConfig[];
    pedidos: Pedido[];
    setPedidos: React.Dispatch<React.SetStateAction<Pedido[]>>;
}

const getStatusColorClass = (status: EstatusPedido) => {
    switch (status) {
        case EstatusPedido.EnEspera: return 'border-t-4 border-blue-400';
        case EstatusPedido.Preparacion: return 'border-t-4 border-yellow-400';
        case EstatusPedido.EnTransito: return 'border-t-4 border-purple-400';
        case EstatusPedido.Entregado: return 'border-t-4 border-green-400';
        case EstatusPedido.Cancelado: return 'border-t-4 border-red-400';
        case EstatusPedido.Regresado: return 'border-t-4 border-orange-400';
        default: return 'border-t-4 border-gray-400';
    }
};

const getStatusIdColorClass = (status: EstatusPedido) => {
    switch (status) {
        case EstatusPedido.EnEspera: return 'bg-blue-100 text-blue-800';
        case EstatusPedido.Preparacion: return 'bg-yellow-100 text-yellow-800';
        case EstatusPedido.EnTransito: return 'bg-purple-100 text-purple-800';
        case EstatusPedido.Entregado: return 'bg-green-100 text-green-800';
        case EstatusPedido.Cancelado: return 'bg-red-100 text-red-800';
        case EstatusPedido.Regresado: return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusIcon = (status: EstatusPedido) => {
    switch (status) {
        case EstatusPedido.EnEspera: return <ClockIcon className="w-5 h-5 mr-2 text-blue-500" />;
        case EstatusPedido.Preparacion: return <SettingsIcon className="w-5 h-5 mr-2 text-yellow-500" />;
        case EstatusPedido.EnTransito: return <PaperAirplaneIcon className="w-5 h-5 mr-2 text-purple-500" />;
        case EstatusPedido.Entregado: return <GiftIcon className="w-5 h-5 mr-2 text-green-500" />;
        case EstatusPedido.Cancelado: return <SadFaceIcon className="w-5 h-5 mr-2 text-red-500" />;
        case EstatusPedido.Regresado: return <ReplyIcon className="w-5 h-5 mr-2 text-orange-500" />;
        default: return null;
    }
};

const KanbanCard: React.FC<{ pedido: Pedido }> = ({ pedido }) => {
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, pedidoId: string) => {
        e.dataTransfer.setData("pedidoId", pedidoId);
    };

    return (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, pedido.id)}
            className="flex bg-white rounded-md shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing transform hover:scale-105 transition-transform duration-200"
        >
            <div className={`flex-shrink-0 w-8 flex items-center justify-center rounded-l-md ${getStatusIdColorClass(pedido.estatus)}`}>
                <span className="text-xs font-bold -rotate-90 whitespace-nowrap tracking-wider">{pedido.id}</span>
            </div>
            <div className="p-3 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-800">{pedido.folio}</span>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-3">{pedido.producto}</p>
                <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center">
                        <span className="font-semibold w-20">Cliente:</span>
                        <span>{pedido.cliente}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-20">Repartidor:</span>
                        <span>{pedido.repartidor}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-20">Turno:</span>
                        <span>{pedido.turno}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-20">F. Entrega:</span>
                        <span>{pedido.fentrega}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KanbanColumn: React.FC<{ 
    title: EstatusPedido; 
    pedidos: Pedido[];
    onDrop: (pedidoId: string, newStatus: EstatusPedido) => void;
}> = ({ title, pedidos, onDrop }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        const pedidoId = e.dataTransfer.getData("pedidoId");
        onDrop(pedidoId, title);
    };

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-shrink-0 w-72 bg-gray-50 rounded-lg shadow-sm transition-colors duration-300 ${isOver ? 'bg-indigo-50' : ''}`}
        >
            <div className={`px-4 py-3 rounded-t-lg ${getStatusColorClass(title)}`}>
                <h3 className="text-md font-semibold text-gray-800 flex justify-between items-center">
                    <div className="flex items-center">
                        {getStatusIcon(title)}
                        <span>{title}</span>
                    </div>
                    <span className="text-sm bg-gray-200 text-gray-700 font-bold rounded-full h-6 w-6 flex items-center justify-center">{pedidos.length}</span>
                </h3>
            </div>
            <div className="p-3 space-y-3 overflow-y-auto h-[calc(100vh-200px)]">
                {pedidos.map(pedido => (
                    <KanbanCard key={pedido.id} pedido={pedido} />
                ))}
            </div>
        </div>
    );
};


const KanbanBoard: React.FC<KanbanBoardProps> = ({ estatusConfig, pedidos, setPedidos }) => {

    // Las columnas ahora se generan dinámicamente desde la configuración de estatus
    const columns: EstatusPedido[] = estatusConfig
        .sort((a, b) => a.id - b.id)
        .map(statusConfig => statusConfig.nombre);

    const getPedidosByStatus = (status: EstatusPedido) => {
        return pedidos.filter(p => p.estatus === status);
    };
    
    const handleDrop = (pedidoId: string, newStatus: EstatusPedido) => {
        const movedPedido = pedidos.find(p => p.id === pedidoId);
        if (movedPedido && movedPedido.estatus !== newStatus) {
            setPedidos(prevPedidos => 
                prevPedidos.map(p => 
                    p.id === pedidoId ? { ...p, estatus: newStatus } : p
                )
            );
        }
    };

    return (
        <div>
            <h3 className="text-gray-700 text-3xl font-medium mb-8">Kanban de Pedidos</h3>
            <div className="flex space-x-4 overflow-x-auto pb-4">
                {columns.map(status => (
                    <KanbanColumn
                        key={status}
                        title={status}
                        pedidos={getPedidosByStatus(status)}
                        onDrop={handleDrop}
                    />
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;