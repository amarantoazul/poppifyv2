
import React, { useState, useMemo, Fragment } from 'react';
import { Logistica, EstatusPedido, EstatusConfig } from '../lib/types';
import { PlusIcon, EditIcon, DeleteIcon, SaveIcon, CancelIcon, SortIcon, SortAscIcon, SortDescIcon } from './icons/Icons';
import CustomSelect from './CustomSelect';

interface LogisticaTableProps {
  logistica: Logistica[];
  setLogistica: React.Dispatch<React.SetStateAction<Logistica[]>>;
  estatusConfig: EstatusConfig[];
  setIsSelectOpen: (isOpen: boolean) => void;
}

const getStatusColor = (status: EstatusPedido) => {
  switch (status) {
    case EstatusPedido.Entregado: return 'bg-green-100 text-green-800';
    case EstatusPedido.Preparacion: return 'bg-yellow-100 text-yellow-800';
    case EstatusPedido.EnEspera: return 'bg-blue-100 text-blue-800';
    case EstatusPedido.Cancelado: return 'bg-red-100 text-red-800';
    case EstatusPedido.EnTransito: return 'bg-purple-100 text-purple-800';
    case EstatusPedido.Regresado: return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

type SortKeys = keyof Logistica;

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

const LogisticaTable: React.FC<LogisticaTableProps> = ({ logistica, setLogistica, estatusConfig, setIsSelectOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRegistro, setNewRegistro] = useState<Omit<Logistica, 'id'>>({
    folio: '', estatus: estatusConfig[0]?.nombre || EstatusPedido.EnEspera, fentrega: '', cliente: '', repartidor: '', pais: 'México', estado: '', ciudad: '', codigoPostal: '', colonia: '', calle: '', referencias: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Logistica | null>(null);
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnKey: keyof Logistica } | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: SortKeys; direction: 'ascending' | 'descending' } | null>(null);

  const estatusOptions = useMemo(() => estatusConfig.map(s => ({ value: s.nombre, label: s.nombre })), [estatusConfig]);

  const sortedLogistica = useMemo(() => {
    let sortableItems = [...logistica];
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
  }, [logistica, sortConfig]);

  const requestSort = (key: SortKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleModalFormChange = (name: string, value: string) => {
    setNewRegistro(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `LOG-${String(logistica.length + 1).padStart(3, '0')}`;
    const newRecord: Logistica = { ...newRegistro, id: newId };
    setLogistica([...logistica, newRecord]);
    setIsModalOpen(false);
    setNewRegistro({ folio: '', estatus: estatusConfig[0]?.nombre || EstatusPedido.EnEspera, fentrega: '', cliente: '', repartidor: '', pais: 'México', estado: '', ciudad: '', codigoPostal: '', colonia: '', calle: '', referencias: '' });
  };

  const handleEditClick = (registro: Logistica) => {
    setEditingId(registro.id);
    setEditingCell(null);
    setEditFormData({ ...registro });
  };
  
  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData(null);
  };
  
  const handleSaveClick = (id: string) => {
      if (!editFormData) return;
      const newLogistica = logistica.map((l) => (l.id === id ? editFormData : l));
      setLogistica(newLogistica);
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

  const handleCellDoubleClick = (rowId: string, columnKey: keyof Logistica) => {
    if (editingId !== rowId) {
        setEditingCell({ rowId, columnKey });
    }
  };

  const handleCellUpdate = (rowId: string, columnKey: keyof Logistica, value: any) => {
    setLogistica(prevLogistica =>
      prevLogistica.map(l =>
        l.id === rowId ? { ...l, [columnKey]: value } : l
      )
    );
    setEditingCell(null);
  };

  const handleCellKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && e.currentTarget.tagName !== 'TEXTAREA') {
          (e.target as HTMLElement).blur();
      } else if (e.key === 'Escape') {
          setEditingCell(null);
      }
  };

  const renderCell = (l: Logistica, columnKey: keyof Logistica) => {
    const isEditing = editingCell?.rowId === l.id && editingCell?.columnKey === columnKey;
    const isDate = ['fentrega'].includes(columnKey);
    const isTextArea = ['referencias'].includes(columnKey);

    if (isEditing) {
        if (columnKey === 'estatus') {
            return (
                <CustomSelect
                    value={l.estatus}
                    options={estatusOptions}
                    onChange={(value) => handleCellUpdate(l.id, columnKey, value as EstatusPedido)}
                    onOpenChange={setIsSelectOpen}
                />
            );
        }
        if (isTextArea) {
          return (
            <textarea
                defaultValue={l[columnKey] as any}
                onBlur={(e) => handleCellUpdate(l.id, columnKey, e.target.value)}
                onKeyDown={handleCellKeyDown}
                autoFocus
                className="w-full px-2 py-1 border rounded-md bg-white text-sm"
                rows={3}
            />
          )
        }
        return (
            <input
                type={isDate ? 'date' : 'text'}
                defaultValue={l[columnKey] as any}
                onBlur={(e) => handleCellUpdate(l.id, columnKey, e.target.value)}
                onKeyDown={handleCellKeyDown}
                autoFocus
                className="w-full px-2 py-1 border rounded-md bg-white text-sm"
            />
        );
    }
    
    if (columnKey === 'estatus') {
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(l.estatus)}`}>
                {l.estatus}
            </span>
        );
    }
    
    return <span className="text-sm text-gray-500 max-w-xs truncate block">{l[columnKey]}</span>;
  };

  const headers: { key: SortKeys, title: string }[] = [
    { key: 'id', title: 'ID' },
    { key: 'folio', title: 'Folio' },
    { key: 'estatus', title: 'Estatus' },
    { key: 'fentrega', title: 'F. Entrega' },
    { key: 'cliente', title: 'Cliente' },
    { key: 'repartidor', title: 'Repartidor' },
    { key: 'pais', title: 'País' },
    { key: 'estado', title: 'Estado' },
    { key: 'ciudad', title: 'Ciudad' },
    { key: 'codigoPostal', title: 'Código Postal' },
    { key: 'colonia', title: 'Colonia' },
    { key: 'calle', title: 'Calle #' },
    { key: 'referencias', title: 'Referencias' },
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
                    options={estatusOptions}
                    onChange={(value) => handleCustomSelectChange('estatus', value)}
                    onOpenChange={setIsSelectOpen}
                />
            </td>
            <td className="px-6 py-4"><input type="date" name="fentrega" value={editFormData.fentrega} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="cliente" value={editFormData.cliente} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="repartidor" value={editFormData.repartidor} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="pais" value={editFormData.pais} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="estado" value={editFormData.estado} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="ciudad" value={editFormData.ciudad} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="codigoPostal" value={editFormData.codigoPostal} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="colonia" value={editFormData.colonia} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="calle" value={editFormData.calle} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><textarea name="referencias" value={editFormData.referencias} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" rows={1}/></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                <button onClick={() => handleSaveClick(editFormData.id)} className="text-green-600 hover:text-green-900"><SaveIcon /></button>
                <button onClick={handleCancelClick} className="text-gray-600 hover:text-gray-900"><CancelIcon /></button>
            </td>
        </tr>
    );
  };
  
  const renderReadOnlyRow = (l: Logistica) => (
    <tr key={l.id} className="hover:bg-gray-50">
        {headers.map(header => (
          <td onDoubleClick={() => handleCellDoubleClick(l.id, header.key)} key={header.key} className="px-6 py-4 whitespace-nowrap">
            {renderCell(l, header.key)}
          </td>
        ))}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
            <button onClick={() => handleEditClick(l)} className="text-indigo-600 hover:text-indigo-900"><EditIcon /></button>
            <button className="text-red-600 hover:text-red-900"><DeleteIcon /></button>
        </td>
    </tr>
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-gray-700 text-3xl font-medium">Logística</h3>
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
                    {sortedLogistica.map((l) => (
                      <Fragment key={l.id}>
                          {editingId === l.id ? renderEditableRow() : renderReadOnlyRow(l)}
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
          <div className="relative mx-auto p-8 border w-full max-w-5xl shadow-lg rounded-md bg-white">
             <h3 className="text-2xl font-semibold text-gray-800 mb-6">Crear Registro de Logística</h3>
             <form onSubmit={handleAddRegistro}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div><label className="text-gray-700">Folio</label><input name="folio" value={newRegistro.folio} onChange={(e) => handleModalFormChange(e.target.name, e.target.value)} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div>
                        <label className="text-gray-700">Estatus</label>
                        <CustomSelect
                            value={newRegistro.estatus}
                            options={estatusOptions}
                            onChange={(value) => handleModalFormChange('estatus', value)}
                            onOpenChange={setIsSelectOpen}
                        />
                    </div>
                    <div><label className="text-gray-700">Fecha de Entrega</label><input type="date" name="fentrega" value={newRegistro.fentrega} onChange={(e) => handleModalFormChange(e.target.name, e.target.value)} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Cliente</label><input name="cliente" value={newRegistro.cliente} onChange={(e) => handleModalFormChange(e.target.name, e.target.value)} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Repartidor</label><input name="repartidor" value={newRegistro.repartidor} onChange={(e) => handleModalFormChange(e.target.name, e.target.value)} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">País</label><input name="pais" value={newRegistro.pais} onChange={(e) => handleModalFormChange(e.target.name, e.target.value)} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Estado</label><input name="estado" value={newRegistro.estado} onChange={(e) => handleModalFormChange(e.target.name, e.target.value)} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Ciudad</label><input name="ciudad" value={newRegistro.ciudad} onChange={(e) => handleModalFormChange(e.target.name, e.target.value)} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Código Postal</label><input name="codigoPostal" value={newRegistro.codigoPostal} onChange={(e) => handleModalFormChange(e.target.name, e.target.value)} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div><label className="text-gray-700">Colonia</label><input name="colonia" value={newRegistro.colonia} onChange={(e) => handleModalFormChange(e.target.name, e.target.value)} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div className="md:col-span-2"><label className="text-gray-700">Calle y Número</label><input name="calle" value={newRegistro.calle} onChange={(e) => handleModalFormChange(e.target.name, e.target.value)} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
                    <div className="md:col-span-4">
                        <label className="text-gray-700">Referencias</label>
                        <textarea name="referencias" value={newRegistro.referencias} onChange={(e) => handleModalFormChange(e.target.name, e.target.value)} rows={3} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
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

export default LogisticaTable;