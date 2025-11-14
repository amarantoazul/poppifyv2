
import React, { useState, Fragment } from 'react';
import { Sucursal, Pedido } from '../../lib/types';
import { EditIcon, DeleteIcon, PauseIcon, PlusIcon, CopyIcon, SaveIcon, CancelIcon } from '../icons/Icons';

interface SucursalPageProps {
  sucursales: Sucursal[];
  setSucursales: React.Dispatch<React.SetStateAction<Sucursal[]>>;
  pedidos: Pedido[];
  setPedidos: React.Dispatch<React.SetStateAction<Pedido[]>>;
}

const SucursalPage: React.FC<SucursalPageProps> = ({ sucursales, setSucursales, pedidos, setPedidos }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Sucursal | null>(null);

  const handleCopy = (sucursal: Sucursal) => {
    const textToCopy = `Sucursal ${sucursal.nombre}\nTeléfono: ${sucursal.telefono}\nDirección: ${sucursal.calle}, ${sucursal.colonia}, ${sucursal.ciudad}, ${sucursal.estado}, ${sucursal.pais}\nGoogle Maps: ${sucursal.mapsUrl}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Datos de la sucursal copiados al portapapeles.');
    });
  };

  const handleEditClick = (sucursal: Sucursal) => {
    setEditingId(sucursal.id);
    setEditFormData({ ...sucursal });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const handleSaveClick = (id: string) => {
    if (!editFormData) return;

    const originalSucursal = sucursales.find(s => s.id === id);
    if (!originalSucursal) return;

    const oldSucursalName = originalSucursal.nombre;
    const newSucursalName = editFormData.nombre;

    const newSucursales = sucursales.map((s) => (s.id === id ? editFormData : s));
    setSucursales(newSucursales);

    if (oldSucursalName !== newSucursalName) {
      const updatedPedidos = pedidos.map(pedido =>
        pedido.sucursal === oldSucursalName ? { ...pedido, sucursal: newSucursalName } : pedido
      );
      setPedidos(updatedPedidos);
    }

    setEditingId(null);
    setEditFormData(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editFormData) return;
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };
  
  const renderReadOnlyRow = (s: Sucursal) => (
    <tr key={s.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.nombre}</td>
        <td className="px-6 py-4 text-sm text-gray-500 max-w-md">{`${s.pais}, ${s.estado}, ${s.ciudad}, ${s.colonia}, ${s.calle}`}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.telefono}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:underline"><a href={s.mapsUrl} target="_blank" rel="noopener noreferrer">Ver en mapa</a></td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
          <button onClick={() => handleCopy(s)} className="text-gray-600 hover:text-gray-900" title="Copiar Datos"><CopyIcon /></button>
          <button onClick={() => handleEditClick(s)} className="text-indigo-600 hover:text-indigo-900" title="Editar"><EditIcon /></button>
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
            <td className="px-6 py-4">
                <div className="grid grid-cols-2 gap-2">
                    <input type="text" name="pais" value={editFormData.pais} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" placeholder="País" />
                    <input type="text" name="estado" value={editFormData.estado} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" placeholder="Estado" />
                    <input type="text" name="ciudad" value={editFormData.ciudad} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" placeholder="Ciudad" />
                    <input type="text" name="colonia" value={editFormData.colonia} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" placeholder="Colonia" />
                    <input type="text" name="calle" value={editFormData.calle} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md col-span-2" placeholder="Calle y número" />
                </div>
            </td>
            <td className="px-6 py-4"><input type="tel" name="telefono" value={editFormData.telefono} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="url" name="mapsUrl" value={editFormData.mapsUrl} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
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
        <h3 className="text-gray-700 text-3xl font-medium">Sucursales</h3>
        <button
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <PlusIcon />
          <span className="ml-2">Agregar Sucursal</span>
        </button>
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección (País, Estado, Ciudad, Colonia, Calle y Número)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Google Maps</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sucursales.map(s => (
               <Fragment key={s.id}>
                {editingId === s.id ? renderEditableRow() : renderReadOnlyRow(s)}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SucursalPage;
