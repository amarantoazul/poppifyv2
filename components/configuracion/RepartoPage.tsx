
import React, { useState, Fragment } from 'react';
import { initialRepartidores } from '../../lib/data';
import { Repartidor } from '../../lib/types';
import { EditIcon, DeleteIcon, PauseIcon, PlusIcon, SaveIcon, CancelIcon } from '../icons/Icons';

const RepartoPage: React.FC = () => {
  const [repartidores, setRepartidores] = useState<Repartidor[]>(initialRepartidores);
  const [filter, setFilter] = useState('30days');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Repartidor | null>(null);

  // En una app real, estos datos se obtendrían de la tabla de pedidos filtrada
  const getRepartidorSummary = (repartidorId: string) => ({
      entregados: Math.floor(Math.random() * 100),
      cancelados: Math.floor(Math.random() * 5),
      retornados: Math.floor(Math.random() * 2),
  });
  
  const handleEditClick = (repartidor: Repartidor) => {
    setEditingId(repartidor.id);
    setEditFormData({ ...repartidor });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const handleSaveClick = (id: string) => {
    if (!editFormData) return;
    const newRepartidores = repartidores.map((r) => (r.id === id ? editFormData : r));
    setRepartidores(newRepartidores);
    setEditingId(null);
    setEditFormData(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editFormData) return;
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };
  
  const renderReadOnlyRow = (r: Repartidor) => {
    const summary = getRepartidorSummary(r.id);
    return (
        <tr key={r.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.repartidor_id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{r.nombre}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.telefono}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${r.marca}, ${r.modelo}, ${r.placas}`}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-semibold">{summary.entregados}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-600 font-semibold">{summary.cancelados}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-yellow-600 font-semibold">{summary.retornados}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                <button onClick={() => handleEditClick(r)} className="text-indigo-600 hover:text-indigo-900" title="Editar"><EditIcon /></button>
                <button className="text-yellow-600 hover:text-yellow-900" title="Pausar"><PauseIcon /></button>
                <button className="text-red-600 hover:text-red-900" title="Eliminar"><DeleteIcon /></button>
            </td>
        </tr>
    )
  };

  const renderEditableRow = () => {
    if (!editFormData) return null;
    const summary = getRepartidorSummary(editFormData.id);
     return (
        <tr className="bg-indigo-50">
            <td className="px-6 py-4"><input type="text" name="repartidor_id" value={editFormData.repartidor_id} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="nombre" value={editFormData.nombre} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="tel" name="telefono" value={editFormData.telefono} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4">
                <div className="flex space-x-2">
                    <input type="text" name="marca" value={editFormData.marca} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" placeholder="Marca" />
                    <input type="text" name="modelo" value={editFormData.modelo} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" placeholder="Modelo" />
                    <input type="text" name="placas" value={editFormData.placas} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" placeholder="Placas" />
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-semibold">{summary.entregados}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-600 font-semibold">{summary.cancelados}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-yellow-600 font-semibold">{summary.retornados}</td>
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
            <h3 className="text-gray-700 text-3xl font-medium">Reparto</h3>
            <button
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
            <PlusIcon />
            <span className="ml-2">Agregar Repartidor</span>
            </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h4 className="text-gray-600 font-semibold mb-3">Filtrar Resumen de Pedidos por Periodo</h4>
             <div className="flex flex-wrap items-center gap-4">
                <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="day">Día</option>
                    <option value="week">Semana</option>
                    <option value="30days">30 Días</option>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">repartidor_id</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Operador</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo (Marca, Modelo, Placas)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entregados</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancelados</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retornados</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {repartidores.map(r => (
                    <Fragment key={r.id}>
                        {editingId === r.id ? renderEditableRow() : renderReadOnlyRow(r)}
                    </Fragment>
                ))}
            </tbody>
            </table>
        </div>
    </div>
  );
};

export default RepartoPage;
