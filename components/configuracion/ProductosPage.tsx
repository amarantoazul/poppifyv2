
import React, { useState, Fragment } from 'react';
import { initialProductos } from '../../lib/data';
import { Producto } from '../../lib/types';
import { EditIcon, DeleteIcon, PauseIcon, PlusIcon, SaveIcon, CancelIcon } from '../icons/Icons';

const ProductosPage: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>(initialProductos);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<Producto | null>(null);

    const handleEditClick = (producto: Producto) => {
        setEditingId(producto.id);
        setEditFormData({ ...producto });
    };

    const handleCancelClick = () => {
        setEditingId(null);
        setEditFormData(null);
    };

    const handleSaveClick = (id: string) => {
        if (!editFormData) return;
        const newProductos = productos.map((p) => (p.id === id ? editFormData : p));
        setProductos(newProductos);
        setEditingId(null);
        setEditFormData(null);
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editFormData) return;
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setEditFormData({ ...editFormData, [name]: isNumber ? parseFloat(value) || 0 : value });
    };

    const renderReadOnlyRow = (producto: Producto) => (
         <tr key={producto.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <img className="h-12 w-12 rounded-md object-cover" src={producto.imagenUrl} alt={producto.nombre} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.nombre}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.sku}</td>
            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{producto.ingredientes}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.categoria}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{producto.precioVenta.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.color}</td>
            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{producto.descripcionCorta}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                <button onClick={() => handleEditClick(producto)} className="text-indigo-600 hover:text-indigo-900" title="Editar"><EditIcon /></button>
                <button className="text-yellow-600 hover:text-yellow-900" title="Pausar"><PauseIcon /></button>
                <button className="text-red-600 hover:text-red-900" title="Eliminar"><DeleteIcon /></button>
            </td>
        </tr>
    );

    const renderEditableRow = () => {
        if (!editFormData) return null;
        return (
            <tr className="bg-indigo-50">
                 <td className="px-6 py-4"><input type="url" name="imagenUrl" value={editFormData.imagenUrl} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
                 <td className="px-6 py-4"><input type="text" name="nombre" value={editFormData.nombre} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
                 <td className="px-6 py-4"><input type="text" name="sku" value={editFormData.sku} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
                 <td className="px-6 py-4"><textarea name="ingredientes" value={editFormData.ingredientes} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" rows={2} /></td>
                 <td className="px-6 py-4"><input type="text" name="categoria" value={editFormData.categoria} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
                 <td className="px-6 py-4"><input type="number" step="0.01" name="precioVenta" value={editFormData.precioVenta} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
                 <td className="px-6 py-4"><input type="text" name="color" value={editFormData.color} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
                 <td className="px-6 py-4"><textarea name="descripcionCorta" value={editFormData.descripcionCorta} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" rows={2} /></td>
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
                <h3 className="text-gray-700 text-3xl font-medium">Productos</h3>
                <button
                  className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                <PlusIcon />
                <span className="ml-2">Agregar Producto</span>
                </button>
            </div>
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingredientes</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio de Venta</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción Corta</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {productos.map(producto => (
                            <Fragment key={producto.id}>
                                {editingId === producto.id ? renderEditableRow() : renderReadOnlyRow(producto)}
                           </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductosPage;
