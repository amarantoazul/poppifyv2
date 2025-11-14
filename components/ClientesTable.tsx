
import React, { useState, useMemo, Fragment } from 'react';
import { Cliente, EstatusCliente } from '../lib/types';
import { initialClientes } from '../lib/data';
import { PlusIcon, EditIcon, DeleteIcon, SaveIcon, CancelIcon, SortIcon, SortAscIcon, SortDescIcon } from './icons/Icons';
import CustomSelect from './CustomSelect';

interface ClientesTableProps {
  setIsSelectOpen: (isOpen: boolean) => void;
}

const getStatusColor = (status: EstatusCliente) => {
  switch (status) {
    case EstatusCliente.Activo: return 'bg-green-100 text-green-800';
    case EstatusCliente.Inactivo: return 'bg-gray-100 text-gray-800';
    case EstatusCliente.Potencial: return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

type SortKeys = keyof Cliente;

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

const ClientesTable: React.FC<ClientesTableProps> = ({ setIsSelectOpen }) => {
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCliente, setNewCliente] = useState<Omit<Cliente, 'id'>>({
    folio: '', estatus: EstatusCliente.Activo, fentrega: '', cliente: '', correo: '', telefono: '', destinatario: '', telDestino: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Cliente | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: SortKeys; direction: 'ascending' | 'descending' } | null>(null);

  const sortedClientes = useMemo(() => {
    let sortableItems = [...clientes];
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
  }, [clientes, sortConfig]);

  const requestSort = (key: SortKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCliente({ ...newCliente, [name]: value });
  };
  
  const handleAddCliente = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `CLI-${String(clientes.length + 1).padStart(3, '0')}`;
    const newRecord: Cliente = { ...newCliente, id: newId };
    setClientes([...clientes, newRecord]);
    setIsModalOpen(false);
    setNewCliente({ folio: '', estatus: EstatusCliente.Activo, fentrega: '', cliente: '', correo: '', telefono: '', destinatario: '', telDestino: '' });
  };

  const handleEditClick = (cliente: Cliente) => {
    setEditingId(cliente.id);
    setEditFormData({ ...cliente });
  };
  
  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData(null);
  };
  
  const handleSaveClick = (id: string) => {
      if (!editFormData) return;
      const newClientes = clientes.map((c) => (c.id === id ? editFormData : c));
      setClientes(newClientes);
      setEditingId(null);
      setEditFormData(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editFormData) return;
      const { name, value } = e.target;
      setEditFormData({ ...editFormData, [name]: value });
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
    { key: 'correo', title: 'Correo' },
    { key: 'telefono', title: 'Teléfono' },
    { key: 'destinatario', title: 'Destinatario' },
    { key: 'telDestino', title: 'Tel. Destino' },
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
                    options={Object.values(EstatusCliente).map(s => ({ value: s, label: s }))}
                    onChange={(value) => handleCustomSelectChange('estatus', value)}
                    onOpenChange={setIsSelectOpen}
                />
            </td>
            <td className="px-6 py-4"><input type="date" name="fentrega" value={editFormData.fentrega} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="cliente" value={editFormData.cliente} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="email" name="correo" value={editFormData.correo} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="tel" name="telefono" value={editFormData.telefono} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="destinatario" value={editFormData.destinatario} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="tel" name="telDestino" value={editFormData.telDestino} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                <button onClick={() => handleSaveClick(editFormData.id)} className="text-green-600 hover:text-green-900"><SaveIcon /></button>
                <button onClick={handleCancelClick} className="text-gray-600 hover:text-gray-900"><CancelIcon /></button>
            </td>
        </tr>
    );
  };
  
  const renderReadOnlyRow = (c: Cliente) => (
    <tr key={c.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.id}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.folio}</td>
        <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(c.estatus)}`}>
            {c.estatus}
            </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.fentrega}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.cliente}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.correo}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.telefono}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.destinatario}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.telDestino}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
            <button onClick={() => handleEditClick(c)} className="text-indigo-600 hover:text-indigo-900"><EditIcon /></button>
            <button className="text-red-600 hover:text-red-900"><DeleteIcon /></button>
        </td>
    </tr>
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-gray-700 text-3xl font-medium">Clientes</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <PlusIcon />
          <span className="ml-2">Crear Nuevo Cliente</span>
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
                    {sortedClientes.map((c) => (
                      <Fragment key={c.id}>
                          {editingId === c.id ? renderEditableRow() : renderReadOnlyRow(c)}
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
             <h3 className="text-2xl font-semibold text-gray-800 mb-6">Crear Nuevo Cliente</h3>
             <form onSubmit={handleAddCliente}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label className="text-gray-700">Folio</label><input name="folio" value={newCliente.folio} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div>
                        <label className="text-gray-700">Estatus</label>
                        <select name="estatus" value={newCliente.estatus} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {Object.values(EstatusCliente).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div><label className="text-gray-700">Fecha de Entrega</label><input type="date" name="fentrega" value={newCliente.fentrega} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Cliente</label><input name="cliente" value={newCliente.cliente} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Correo Electrónico</label><input type="email" name="correo" value={newCliente.correo} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Teléfono</label><input type="tel" name="telefono" value={newCliente.telefono} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Destinatario</label><input name="destinatario" value={newCliente.destinatario} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Teléfono Destino</label><input type="tel" name="telDestino" value={newCliente.telDestino} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
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

export default ClientesTable;