
import React, { useState, Fragment } from 'react';
import { initialTurnos } from '../../lib/data';
import { Turno } from '../../lib/types';
import { EditIcon, DeleteIcon, PauseIcon, PlusIcon, SaveIcon, CancelIcon } from '../icons/Icons';

const TurnosPage: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>(initialTurnos);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Turno | null>(null);

  const handleEditClick = (turno: Turno) => {
    setEditingId(turno.id);
    setEditFormData({ ...turno });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const handleSaveClick = (id: string) => {
    if (!editFormData) return;
    const newTurnos = turnos.map((turno) => (turno.id === id ? editFormData : turno));
    setTurnos(newTurnos);
    setEditingId(null);
    setEditFormData(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editFormData) return;
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const renderReadOnlyRow = (turno: Turno) => (
    <tr key={turno.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{turno.nombre}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{turno.horario}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
          <button onClick={() => handleEditClick(turno)} className="text-indigo-600 hover:text-indigo-900" title="Editar"><EditIcon /></button>
          <button className="text-yellow-600 hover:text-yellow-900" title="Pausar"><PauseIcon /></button>
          <button className="text-red-600 hover:text-red-900" title="Eliminar"><DeleteIcon /></button>
        </td>
    </tr>
  );

  const renderEditableRow = () => {
    if(!editFormData) return null;
    return (
        <tr className="bg-indigo-50">
            <td className="px-6 py-4"><input type="text" name="nombre" value={editFormData.nombre} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="horario" value={editFormData.horario} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
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
        <h3 className="text-gray-700 text-3xl font-medium">Turnos</h3>
        <button
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <PlusIcon />
          <span className="ml-2">Agregar Turno</span>
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg max-w-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {turnos.map(turno => (
               <Fragment key={turno.id}>
                {editingId === turno.id ? renderEditableRow() : renderReadOnlyRow(turno)}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TurnosPage;
