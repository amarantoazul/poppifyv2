
import React, { useState, Fragment } from 'react';
import { initialClientesConfig } from '../../lib/data';
import { ClienteConfig } from '../../lib/types';
import { EditIcon, DeleteIcon, PauseIcon, PlusIcon, SaveIcon, CancelIcon } from '../icons/Icons';

const ClientesConfigPage: React.FC = () => {
    const [clientes, setClientes] = useState<ClienteConfig[]>(initialClientesConfig);
    const [filter, setFilter] = useState('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<ClienteConfig | null>(null);

    const handleEditClick = (cliente: ClienteConfig) => {
        setEditingId(cliente.id);
        setEditFormData({ ...cliente });
    };

    const handleCancelClick = () => {
        setEditingId(null);
        setEditFormData(null);
    };

    const handleSaveClick = (id: string) => {
        if (!editFormData) return;
        const newClientes = clientes.map((cliente) => (cliente.id === id ? editFormData : cliente));
        setClientes(newClientes);
        setEditingId(null);
        setEditFormData(null);
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editFormData) return;
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const renderReadOnlyRow = (cliente: ClienteConfig) => (
        <tr key={cliente.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cliente.nombre}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.telefono}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.correo}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-700">{cliente.ventas}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">{cliente.montoTotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-700">{cliente.pedidos}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                <button onClick={() => handleEditClick(cliente)} className="text-indigo-600 hover:text-indigo-900" title="Editar"><EditIcon /></button>
                <button className="text-yellow-600 hover:text-yellow-900" title="Pausar"><PauseIcon /></button>
                <button className="text-red-600 hover:text-red-900" title="Eliminar"><DeleteIcon /></button>
            </td>
        </tr>
    );

    const renderEditableRow = () => {
        if (!editFormData) return null;
        return (
            <tr className="bg-indigo-50">
                <td className="px-6 py-4"><input type="text" name="nombre" value={editFormData.nombre} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
                <td className="px-6 py-4"><input type="tel" name="telefono" value={editFormData.telefono} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
                <td className="px-6 py-4"><input type="email" name="correo" value={editFormData.correo} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-700">{editFormData.ventas}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">{editFormData.montoTotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-700">{editFormData.pedidos}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                    <button onClick={() => handleSaveClick(editFormData.id)} className="text-green-600 hover:text-green-900" title="Guardar"><SaveIcon /></button>
                    <button onClick={handleCancelClick} className="text-gray-600 hover:text-gray-900" title="Cancelar"><CancelIcon /></button>
                </td>
            </tr>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-gray-700 text-3xl font-medium">Clientes</h3>
                <button
                  className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                <PlusIcon />
                <span className="ml-2">Agregar Cliente</span>
                </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h4 className="text-gray-600 font-semibold mb-3">Filtrar por Periodo</h4>
                <div className="flex flex-wrap items-center gap-4">
                    <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="day">Día</option>
                        <option value="7days">7 Días</option>
                        <option value="30days">30 Días</option>
                        <option value="all">Periodo Completo</option>
                    </select>
                    <div className="flex items-center space-x-2">
                        <label>Desde:</label>
                        <input type="date" className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <label>Hasta:</label>
                        <input type="date" className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>
            </div>

            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo Electrónico</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Ventas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Total Acumulado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Pedidos</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                       {clientes.map(cliente => (
                           <Fragment key={cliente.id}>
                               {editingId === cliente.id ? renderEditableRow() : renderReadOnlyRow(cliente)}
                           </Fragment>
                       ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClientesConfigPage;
