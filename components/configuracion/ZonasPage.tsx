
import React, { useState, Fragment } from 'react';
import { initialZonas } from '../../lib/data';
import { Zona } from '../../lib/types';
import { EditIcon, DeleteIcon, PauseIcon, PlusIcon, SaveIcon, CancelIcon } from '../icons/Icons';

const ZonasPage: React.FC = () => {
  const [zonas, setZonas] = useState<Zona[]>(initialZonas);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Zona | null>(null);

  const handleEditClick = (zona: Zona) => {
    setEditingId(zona.id);
    setEditFormData({ ...zona });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const handleSaveClick = (id: string) => {
    if (!editFormData) return;
    const newZonas = zonas.map((zona) => (zona.id === id ? editFormData : zona));
    setZonas(newZonas);
    setEditingId(null);
    setEditFormData(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editFormData) return;
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const renderReadOnlyRow = (zona: Zona) => (
     <tr key={zona.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{zona.pais}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{zona.estado}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{zona.ciudad}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
          <button onClick={() => handleEditClick(zona)} className="text-indigo-600 hover:text-indigo-900" title="Editar"><EditIcon /></button>
          <button className="text-yellow-600 hover:text-yellow-900" title="Pausar"><PauseIcon /></button>
          <button className="text-red-600 hover:text-red-900" title="Eliminar"><DeleteIcon /></button>
        </td>
    </tr>
  );

  const renderEditableRow = () => {
    if (!editFormData) return null;
    return (
        <tr className="bg-indigo-50">
            <td className="px-6 py-4"><input type="text" name="pais" value={editFormData.pais} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="estado" value={editFormData.estado} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="ciudad" value={editFormData.ciudad} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
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
        <h3 className="text-gray-700 text-3xl font-medium">Zonas de Reparto</h3>
        <button
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <PlusIcon />
          <span className="ml-2">Agregar Zona</span>
        </button>
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad / Municipio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {zonas.map(zona => (
               <Fragment key={zona.id}>
                {editingId === zona.id ? renderEditableRow() : renderReadOnlyRow(zona)}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ZonasPage;
