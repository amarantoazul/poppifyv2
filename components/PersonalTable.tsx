
import React, { useState, useMemo, Fragment } from 'react';
import { Personal, EstatusPersonal } from '../lib/types';
import { initialPersonal } from '../lib/data';
import { PlusIcon, EditIcon, DeleteIcon, SaveIcon, CancelIcon, SortIcon, SortAscIcon, SortDescIcon } from './icons/Icons';
import CustomSelect from './CustomSelect';

interface PersonalTableProps {
  setIsSelectOpen: (isOpen: boolean) => void;
}

const getStatusColor = (status: EstatusPersonal) => {
  switch (status) {
    case EstatusPersonal.Entregado: return 'bg-green-100 text-green-800';
    case EstatusPersonal.Listo: return 'bg-blue-100 text-blue-800';
    case EstatusPersonal.EnDiseño: return 'bg-yellow-100 text-yellow-800';
    case EstatusPersonal.Pendiente: return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

type SortKeys = keyof Personal;

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

const PersonalTable: React.FC<PersonalTableProps> = ({ setIsSelectOpen }) => {
  const [personal, setPersonal] = useState<Personal[]>(initialPersonal);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRegistro, setNewRegistro] = useState<Omit<Personal, 'id'>>({
    folio: '', estatus: EstatusPersonal.Pendiente, fentrega: '', cliente: '', dedicatoria: '', notas: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Personal | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: SortKeys; direction: 'ascending' | 'descending' } | null>(null);

  const sortedPersonal = useMemo(() => {
    let sortableItems = [...personal];
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
  }, [personal, sortConfig]);

  const requestSort = (key: SortKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRegistro({ ...newRegistro, [name]: value });
  };
  
  const handleAddRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `PER-${String(personal.length + 1).padStart(3, '0')}`;
    const newRecord: Personal = { ...newRegistro, id: newId };
    setPersonal([...personal, newRecord]);
    setIsModalOpen(false);
    setNewRegistro({ folio: '', estatus: EstatusPersonal.Pendiente, fentrega: '', cliente: '', dedicatoria: '', notas: '' });
  };

  const handleEditClick = (registro: Personal) => {
    setEditingId(registro.id);
    setEditFormData({ ...registro });
  };
  
  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData(null);
  };
  
  const handleSaveClick = (id: string) => {
      if (!editFormData) return;
      const newPersonal = personal.map((p) => (p.id === id ? editFormData : p));
      setPersonal(newPersonal);
      setEditingId(null);
      setEditFormData(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    { key: 'dedicatoria', title: 'Dedicatoria' },
    { key: 'notas', title: 'Notas' },
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
                    options={Object.values(EstatusPersonal).map(s => ({ value: s, label: s }))}
                    onChange={(value) => handleCustomSelectChange('estatus', value)}
                    onOpenChange={setIsSelectOpen}
                />
            </td>
            <td className="px-6 py-4"><input type="date" name="fentrega" value={editFormData.fentrega} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="cliente" value={editFormData.cliente} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><textarea name="dedicatoria" value={editFormData.dedicatoria} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" rows={2} /></td>
            <td className="px-6 py-4"><textarea name="notas" value={editFormData.notas} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" rows={2} /></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                <button onClick={() => handleSaveClick(editFormData.id)} className="text-green-600 hover:text-green-900"><SaveIcon /></button>
                <button onClick={handleCancelClick} className="text-gray-600 hover:text-gray-900"><CancelIcon /></button>
            </td>
        </tr>
    );
  };
  
  const renderReadOnlyRow = (p: Personal) => (
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
        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{p.dedicatoria}</td>
        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{p.notas}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
            <button onClick={() => handleEditClick(p)} className="text-indigo-600 hover:text-indigo-900"><EditIcon /></button>
            <button className="text-red-600 hover:text-red-900"><DeleteIcon /></button>
        </td>
    </tr>
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-gray-700 text-3xl font-medium">Personal</h3>
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
                    {sortedPersonal.map((p) => (
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
             <h3 className="text-2xl font-semibold text-gray-800 mb-6">Crear Registro Personal</h3>
             <form onSubmit={handleAddRegistro}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="text-gray-700">Folio</label><input name="folio" value={newRegistro.folio} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div>
                        <label className="text-gray-700">Estatus</label>
                        <select name="estatus" value={newRegistro.estatus} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {Object.values(EstatusPersonal).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div><label className="text-gray-700">Fecha de Entrega</label><input type="date" name="fentrega" value={newRegistro.fentrega} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Cliente</label><input name="cliente" value={newRegistro.cliente} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div className="md:col-span-2">
                        <label className="text-gray-700">Dedicatoria</label>
                        <textarea name="dedicatoria" value={newRegistro.dedicatoria} onChange={handleInputChange} rows={3} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>
                     <div className="md:col-span-2">
                        <label className="text-gray-700">Notas Adicionales</label>
                        <textarea name="notas" value={newRegistro.notas} onChange={handleInputChange} rows={3} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>
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

export default PersonalTable;