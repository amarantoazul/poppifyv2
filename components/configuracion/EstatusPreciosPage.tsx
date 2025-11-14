
import React, { useState, Fragment } from 'react';
// FIX: Replace non-existent `EstatusPrecioConfig` with the correct unified `EstatusConfig` type.
import { EstatusConfig, Precio, EstatusPedido } from '../../lib/types';
import { EditIcon, DeleteIcon, PauseIcon, PlusIcon, SaveIcon, CancelIcon } from '../icons/Icons';

interface EstatusPreciosPageProps {
  // FIX: Use `EstatusConfig` type.
  estatuses: EstatusConfig[];
  setEstatuses: React.Dispatch<React.SetStateAction<EstatusConfig[]>>;
  precios: Precio[];
  setPrecios: React.Dispatch<React.SetStateAction<Precio[]>>;
}

const EstatusPreciosPage: React.FC<EstatusPreciosPageProps> = ({ estatuses, setEstatuses, precios, setPrecios }) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    // FIX: Use `EstatusConfig` type.
    const [editFormData, setEditFormData] = useState<EstatusConfig | null>(null);

    // FIX: Use `EstatusConfig` type.
    const handleEditClick = (estatus: EstatusConfig) => {
        setEditingId(estatus.id);
        setEditFormData({ ...estatus });
    };

    const handleCancelClick = () => {
        setEditingId(null);
        setEditFormData(null);
    };

    const handleSaveClick = (id: number) => {
        if (!editFormData) return;
        
        const originalStatus = estatuses.find(e => e.id === id);
        if (!originalStatus) return;

        const oldStatusName = originalStatus.nombre;
        const newStatusName = editFormData.nombre;

        const newEstatuses = estatuses.map((estatus) => (estatus.id === id ? editFormData : estatus));
        setEstatuses(newEstatuses);

        if (oldStatusName !== newStatusName) {
            const updatedPrecios = precios.map(precio => {
                if (precio.estatus === oldStatusName) {
                    // FIX: Ensure the new status name is cast to EstatusPedido
                    return { ...precio, estatus: newStatusName as EstatusPedido };
                }
                return precio;
            });
            setPrecios(updatedPrecios);
        }

        setEditingId(null);
        setEditFormData(null);
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editFormData) return;
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value as EstatusPedido });
    };
    
    // FIX: Use `EstatusConfig` type.
    const renderReadOnlyRow = (estatus: EstatusConfig) => (
         <tr key={estatus.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-900">{estatus.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{estatus.nombre}</td>
            <td className="px-6 py-4 text-sm text-gray-500 max-w-sm">{estatus.descripcion}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                <button onClick={() => handleEditClick(estatus)} className="text-indigo-600 hover:text-indigo-900" title="Editar"><EditIcon /></button>
                <button className="text-yellow-600 hover:text-yellow-900" title="Pausar"><PauseIcon /></button>
                <button className="text-red-600 hover:text-red-900" title="Eliminar"><DeleteIcon /></button>
            </td>
        </tr>
    );

    const renderEditableRow = () => {
        if (!editFormData) return null;
        return (
            <tr className="bg-indigo-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-900">{editFormData.id}</td>
                <td className="px-6 py-4">
                    <input type="text" name="nombre" value={editFormData.nombre} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" />
                </td>
                <td className="px-6 py-4">
                     <textarea name="descripcion" value={editFormData.descripcion} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" rows={2}></textarea>
                </td>
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
                <h3 className="text-gray-700 text-3xl font-medium">Estatus de Precios</h3>
                <button
                  className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                <PlusIcon />
                <span className="ml-2">Agregar Estatus</span>
                </button>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orden</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Estatus</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción Breve</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {estatuses.sort((a,b) => a.id - b.id).map(estatus => (
                             <Fragment key={estatus.id}>
                                {editingId === estatus.id ? renderEditableRow() : renderReadOnlyRow(estatus)}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EstatusPreciosPage;
