
import React, { useState, useMemo, Fragment } from 'react';
import { Precio, EstatusPrecio } from '../lib/types';
import { initialPrecios } from '../lib/data';
import { PlusIcon, EditIcon, DeleteIcon, SaveIcon, CancelIcon, SortIcon, SortAscIcon, SortDescIcon } from './icons/Icons';
import CustomSelect from './CustomSelect';

interface PreciosTableProps {
  setIsSelectOpen: (isOpen: boolean) => void;
}

const getStatusColor = (status: EstatusPrecio) => {
  switch (status) {
    case EstatusPrecio.Pagado: return 'bg-green-100 text-green-800';
    case EstatusPrecio.Pendiente: return 'bg-yellow-100 text-yellow-800';
    case EstatusPrecio.Vencido: return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

type SortKeys = keyof Precio;

const SortableHeader: React.FC<{
  column: SortKeys;
  title: string;
  sortConfig: { key: SortKeys; direction: 'ascending' | 'descending' } | null;
  requestSort: (key: SortKeys) => void;
}> = ({ column, title, sortConfig, requestSort }) => {
  const isSorted = sortConfig?.key === column;
  const direction = isSorted ? sortConfig.direction : undefined;

  const getSortIcon = () => {
    if (!isSorted) return <SortIcon />;
    if (direction === 'ascending') return <SortAscIcon />;
    return <SortDescIcon />;
  };

  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
      onClick={() => requestSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{title}</span>
        {getSortIcon()}
      </div>
    </th>
  );
};

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

const PreciosTable: React.FC<PreciosTableProps> = ({ setIsSelectOpen }) => {
  const [precios, setPrecios] = useState<Precio[]>(initialPrecios);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPrecio, setNewPrecio] = useState<Omit<Precio, 'id' | 'ganancia'>>({
    folio: '', estatus: EstatusPrecio.Pendiente, fentrega: '', cliente: '', fPago: '', precio: 0, envio: 0, costo: 0, producto: '', sku: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Precio | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: SortKeys; direction: 'ascending' | 'descending' } | null>(null);

  const sortedPrecios = useMemo(() => {
    let sortableItems = [...precios];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [precios, sortConfig]);

  const requestSort = (key: SortKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setNewPrecio({ ...newPrecio, [name]: isNumber ? parseFloat(value) || 0 : value });
  };
  
  const handleAddPrecio = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `PRC-${String(precios.length + 1).padStart(3, '0')}`;
    const ganancia = newPrecio.precio - newPrecio.costo;
    const newRecord: Precio = {
      ...newPrecio,
      id: newId,
      ganancia: ganancia,
    };
    setPrecios([...precios, newRecord]);
    setIsModalOpen(false);
    setNewPrecio({ folio: '', estatus: EstatusPrecio.Pendiente, fentrega: '', cliente: '', fPago: '', precio: 0, envio: 0, costo: 0, producto: '', sku: '' });
  };

  const handleEditClick = (precio: Precio) => {
    setEditingId(precio.id);
    setEditFormData({ ...precio });
  };
  
  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData(null);
  };
  
  const handleSaveClick = (id: string) => {
      if (!editFormData) return;
      const ganancia = editFormData.precio - editFormData.costo;
      const updatedPrecios = precios.map((p) => (p.id === id ? { ...editFormData, ganancia } : p));
      setPrecios(updatedPrecios);
      setEditingId(null);
      setEditFormData(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editFormData) return;
      const { name, value, type } = e.target;
      const isNumber = type === 'number';
      setEditFormData({ ...editFormData, [name]: isNumber ? parseFloat(value) || 0 : value });
  };
  
  const handleCustomSelectChange = (name: string, value: string) => {
      if (!editFormData) return;
      setEditFormData({ ...editFormData, [name]: value });
  };

  const headers: { key: SortKeys, title: string }[] = [
    { key: 'id', title: 'ID' },
    { key: 'folio', title: 'Folio' },
    { key: 'estatus', title: 'Estatus' },
    { key: 'fentrega', title: 'F. Entrega' },
    { key: 'cliente', title: 'Cliente' },
    { key: 'fPago', title: 'Forma de Pago' },
    { key: 'precio', title: 'Precio' },
    { key: 'envio', title: 'Envío' },
    { key: 'costo', title: 'Costo' },
    { key: 'ganancia', title: 'Ganancia' },
    { key: 'producto', title: 'Producto' },
    { key: 'sku', title: 'Sku' },
  ];
  
  const renderEditableRow = () => {
    if (!editFormData) return null;
    return (
        <tr className="bg-indigo-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{editFormData.id}</td>
            <td className="px-6 py-4"><input type="text" name="folio" value={editFormData.folio} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4">
                <CustomSelect
                    value={editFormData.estatus}
                    options={Object.values(EstatusPrecio).map(s => ({ value: s, label: s }))}
                    onChange={(value) => handleCustomSelectChange('estatus', value)}
                    onOpenChange={setIsSelectOpen}
                />
            </td>
            <td className="px-6 py-4"><input type="date" name="fentrega" value={editFormData.fentrega} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="cliente" value={editFormData.cliente} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="fPago" value={editFormData.fPago} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="number" name="precio" value={editFormData.precio} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="number" name="envio" value={editFormData.envio} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="number" name="costo" value={editFormData.costo} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(editFormData.precio - editFormData.costo)}</td>
            <td className="px-6 py-4"><input type="text" name="producto" value={editFormData.producto} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="sku" value={editFormData.sku} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                <button onClick={() => handleSaveClick(editFormData.id)} className="text-green-600 hover:text-green-900"><SaveIcon /></button>
                <button onClick={handleCancelClick} className="text-gray-600 hover:text-gray-900"><CancelIcon /></button>
            </td>
        </tr>
    );
  };
  
  const renderReadOnlyRow = (p: Precio) => (
    <tr key={p.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.folio}</td>
        <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(p.estatus)}`}>
            {p.estatus}
            </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.fentrega}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.cliente}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.fPago}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(p.precio)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(p.envio)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(p.costo)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{formatCurrency(p.ganancia)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.producto}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.sku}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
            <button onClick={() => handleEditClick(p)} className="text-indigo-600 hover:text-indigo-900"><EditIcon /></button>
            <button className="text-red-600 hover:text-red-900"><DeleteIcon /></button>
        </td>
    </tr>
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-gray-700 text-3xl font-medium">Precios</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <PlusIcon />
          <span className="ml-2">Crear Nuevo Registro</span>
        </button>
      </div>

      <div className="mt-8">
        <div className="flex flex-col">
          <div className="-my-2 sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {headers.map(header => (
                        <SortableHeader key={header.key} column={header.key} title={header.title} sortConfig={sortConfig} requestSort={requestSort} />
                      ))}
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedPrecios.map((p) => (
                      <Fragment key={p.id}>
                          {editingId === p.id ? renderEditableRow() : renderReadOnlyRow(p)}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-20">
          <div className="relative mx-auto p-8 border w-full max-w-4xl shadow-lg rounded-md bg-white">
             <h3 className="text-2xl font-semibold text-gray-800 mb-6">Crear Nuevo Registro de Precio</h3>
             <form onSubmit={handleAddPrecio}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div><label className="text-gray-700">Folio</label><input name="folio" value={newPrecio.folio} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div>
                        <label className="text-gray-700">Estatus</label>
                        <select name="estatus" value={newPrecio.estatus} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {Object.values(EstatusPrecio).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div><label className="text-gray-700">Fecha de Entrega</label><input type="date" name="fentrega" value={newPrecio.fentrega} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Cliente</label><input name="cliente" value={newPrecio.cliente} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Forma de Pago</label><input type="text" name="fPago" value={newPrecio.fPago} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Producto</label><input name="producto" value={newPrecio.producto} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">SKU</label><input name="sku" value={newPrecio.sku} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div className="md:col-span-1"></div> {/* Placeholder for alignment */}
                    <div><label className="text-gray-700">Precio</label><input type="number" step="0.01" name="precio" value={newPrecio.precio} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Envío</label><input type="number" step="0.01" name="envio" value={newPrecio.envio} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Costo</label><input type="number" step="0.01" name="costo" value={newPrecio.costo} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                </div>
                <div className="flex justify-end mt-8 space-x-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100">Cancelar</button>
                    <button type="submit" className="px-6 py-2 text-white bg-primary rounded-md hover:bg-indigo-700">Guardar</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PreciosTable;