
import React, { useState, useMemo, Fragment } from 'react';
import { Pedido, EstatusPedido } from '../lib/types';
import { PlusIcon, EditIcon, DeleteIcon, SaveIcon, CancelIcon, SortIcon, SortAscIcon, SortDescIcon } from './icons/Icons';
import CustomSelect from './CustomSelect';

interface PedidosTableProps {
  pedidos: Pedido[];
  setPedidos: React.Dispatch<React.SetStateAction<Pedido[]>>;
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

type SortKeys = keyof Pedido;

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
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => requestSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{title}</span>
        {getSortIcon()}
      </div>
    </th>
  );
};


const PedidosTable: React.FC<PedidosTableProps> = ({ pedidos, setPedidos, setIsSelectOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPedido, setNewPedido] = useState<Omit<Pedido, 'id'>>({
    folio: '', cliente: '', fcompra: '', fentrega: '', estatus: EstatusPedido.EnEspera, turno: 'Matutino', sucursal: '', repartidor: '', producto: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Pedido | null>(null);
  
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnKey: keyof Pedido } | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: SortKeys; direction: 'ascending' | 'descending' } | null>(null);

  const sortedPedidos = useMemo(() => {
    let sortableItems = [...pedidos];
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
  }, [pedidos, sortConfig]);

  const requestSort = (key: SortKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPedido({ ...newPedido, [name]: value });
  };
  
  const handleAddPedido = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `ORD-${String(pedidos.length + 1).padStart(3, '0')}`;
    const newRecord: Pedido = {
      ...newPedido,
      id: newId,
    };
    setPedidos([...pedidos, newRecord]);
    setIsModalOpen(false);
    setNewPedido({ folio: '', cliente: '', fcompra: '', fentrega: '', estatus: EstatusPedido.EnEspera, turno: 'Matutino', sucursal: '', repartidor: '', producto: '' });
  };

  const handleEditClick = (pedido: Pedido) => {
    setEditingId(pedido.id);
    setEditingCell(null);
    setEditFormData({ ...pedido });
  };
  
  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData(null);
  };
  
  const handleSaveClick = (id: string) => {
      if (!editFormData) return;
      const newPedidos = pedidos.map((pedido) => (pedido.id === id ? editFormData : pedido));
      setPedidos(newPedidos);
      setEditingId(null);
      setEditFormData(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (!editFormData) return;
      const { name, value } = e.target;
      setEditFormData({ ...editFormData, [name]: value });
  };
  
  const handleCustomSelectChange = (name: string, value: string) => {
      if (!editFormData) return;
      setEditFormData({ ...editFormData, [name]: value });
  };

  const handleCellDoubleClick = (rowId: string, columnKey: keyof Pedido) => {
    if (editingId !== rowId) {
        setEditingCell({ rowId, columnKey });
    }
  };

  const handleCellUpdate = (rowId: string, columnKey: keyof Pedido, value: any) => {
    setPedidos(prevPedidos =>
      prevPedidos.map(pedido =>
        pedido.id === rowId ? { ...pedido, [columnKey]: value } : pedido
      )
    );
    setEditingCell(null);
  };

  const handleCellKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          (e.target as HTMLElement).blur();
      } else if (e.key === 'Escape') {
          setEditingCell(null);
      }
  };

  const renderCell = (pedido: Pedido, columnKey: keyof Pedido, type: 'text' | 'date' | 'select' = 'text') => {
    const isEditing = editingCell?.rowId === pedido.id && editingCell?.columnKey === columnKey;

    if (isEditing) {
        if (columnKey === 'estatus') {
            return (
                <CustomSelect
                    value={pedido.estatus}
                    options={Object.values(EstatusPedido).map(s => ({ value: s, label: s }))}
                    onChange={(value) => handleCellUpdate(pedido.id, columnKey, value as EstatusPedido)}
                    onOpenChange={setIsSelectOpen}
                />
            );
        }
        if (columnKey === 'turno') {
             return (
                <CustomSelect
                    value={pedido.turno}
                    options={[{value: 'Matutino', label: 'Matutino'}, {value: 'Vespertino', label: 'Vespertino'}, {value: 'Nocturno', label: 'Nocturno'}]}
                    onChange={(value) => handleCellUpdate(pedido.id, columnKey, value)}
                    onOpenChange={setIsSelectOpen}
                />
            );
        }
        return (
            <input
                type={type}
                defaultValue={pedido[columnKey] as string}
                onBlur={(e) => handleCellUpdate(pedido.id, columnKey, e.target.value)}
                onKeyDown={handleCellKeyDown}
                autoFocus
                className="w-full px-2 py-1 border rounded-md bg-white text-sm"
            />
        );
    }
    
    if (columnKey === 'estatus') {
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pedido.estatus)}`}>
                {pedido.estatus}
            </span>
        );
    }

    return <span className="text-sm text-gray-500">{pedido[columnKey]}</span>;
  };


  const headers: { key: SortKeys, title: string }[] = [
    { key: 'id', title: 'ID' },
    { key: 'folio', title: 'FOLIO' },
    { key: 'estatus', title: 'Estatus' },
    { key: 'fentrega', title: 'F. Entrega' },
    { key: 'cliente', title: 'Cliente' },
    { key: 'producto', title: 'Producto' },
    { key: 'repartidor', title: 'Repartidor' },
    { key: 'turno', title: 'Turno' },
    { key: 'sucursal', title: 'Sucursal' },
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
                    options={Object.values(EstatusPedido).map(s => ({ value: s, label: s }))}
                    onChange={(value) => handleCustomSelectChange('estatus', value as EstatusPedido)}
                    onOpenChange={setIsSelectOpen}
                />
            </td>
            <td className="px-6 py-4"><input type="date" name="fentrega" value={editFormData.fentrega} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="cliente" value={editFormData.cliente} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="producto" value={editFormData.producto} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4"><input type="text" name="repartidor" value={editFormData.repartidor} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4">
                 <CustomSelect
                    value={editFormData.turno}
                    options={[{value: 'Matutino', label: 'Matutino'}, {value: 'Vespertino', label: 'Vespertino'}, {value: 'Nocturno', label: 'Nocturno'}]}
                    onChange={(value) => handleCustomSelectChange('turno', value)}
                    onOpenChange={setIsSelectOpen}
                />
            </td>
            <td className="px-6 py-4"><input type="text" name="sucursal" value={editFormData.sucursal} onChange={handleEditFormChange} className="w-full px-2 py-1 border rounded-md" /></td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                <button onClick={() => handleSaveClick(editFormData.id)} className="text-green-600 hover:text-green-900"><SaveIcon /></button>
                <button onClick={handleCancelClick} className="text-gray-600 hover:text-gray-900"><CancelIcon /></button>
            </td>
        </tr>
    );
  };

  const renderReadOnlyRow = (pedido: Pedido) => (
    <tr key={pedido.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pedido.id}</td>
        <td onDoubleClick={() => handleCellDoubleClick(pedido.id, 'folio')} className="px-6 py-4 whitespace-nowrap">{renderCell(pedido, 'folio')}</td>
        <td onDoubleClick={() => handleCellDoubleClick(pedido.id, 'estatus')} className="px-6 py-4 whitespace-nowrap">{renderCell(pedido, 'estatus', 'select')}</td>
        <td onDoubleClick={() => handleCellDoubleClick(pedido.id, 'fentrega')} className="px-6 py-4 whitespace-nowrap">{renderCell(pedido, 'fentrega', 'date')}</td>
        <td onDoubleClick={() => handleCellDoubleClick(pedido.id, 'cliente')} className="px-6 py-4 whitespace-nowrap">{renderCell(pedido, 'cliente')}</td>
        <td onDoubleClick={() => handleCellDoubleClick(pedido.id, 'producto')} className="px-6 py-4 whitespace-nowrap">{renderCell(pedido, 'producto')}</td>
        <td onDoubleClick={() => handleCellDoubleClick(pedido.id, 'repartidor')} className="px-6 py-4 whitespace-nowrap">{renderCell(pedido, 'repartidor')}</td>
        <td onDoubleClick={() => handleCellDoubleClick(pedido.id, 'turno')} className="px-6 py-4 whitespace-nowrap">{renderCell(pedido, 'turno', 'select')}</td>
        <td onDoubleClick={() => handleCellDoubleClick(pedido.id, 'sucursal')} className="px-6 py-4 whitespace-nowrap">{renderCell(pedido, 'sucursal')}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
            <button onClick={() => handleEditClick(pedido)} className="text-indigo-600 hover:text-indigo-900"><EditIcon /></button>
            <button className="text-red-600 hover:text-red-900"><DeleteIcon /></button>
        </td>
    </tr>
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-gray-700 text-3xl font-medium">Pedidos</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <PlusIcon />
          <span className="ml-2">Crear Nuevo Pedido</span>
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
                    {sortedPedidos.map((pedido) => (
                      <Fragment key={pedido.id}>
                          {editingId === pedido.id ? renderEditableRow() : renderReadOnlyRow(pedido)}
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
          <div className="relative mx-auto p-8 border w-full max-w-3xl shadow-lg rounded-md bg-white">
             <h3 className="text-2xl font-semibold text-gray-800 mb-6">Crear Nuevo Pedido</h3>
             <form onSubmit={handleAddPedido}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-gray-700">FOLIO</label>
                        <input name="folio" value={newPedido.folio} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label className="text-gray-700">Estatus</label>
                        <select name="estatus" value={newPedido.estatus} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {Object.values(EstatusPedido).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-700">F. Compra</label>
                        <input type="date" name="fcompra" value={newPedido.fcompra} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label className="text-gray-700">F. Entrega</label>
                        <input type="date" name="fentrega" value={newPedido.fentrega} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label className="text-gray-700">Cliente</label>
                        <input name="cliente" value={newPedido.cliente} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                     <div>
                        <label className="text-gray-700">Producto</label>
                        <input name="producto" value={newPedido.producto} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label className="text-gray-700">Repartidor</label>
                        <input name="repartidor" value={newPedido.repartidor} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                        <label className="text-gray-700">Turno</label>
                        <select name="turno" value={newPedido.turno} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Matutino</option>
                            <option>Vespertino</option>
                            <option>Nocturno</option>
                        </select>
                    </div>
                     <div className="md:col-span-2">
                        <label className="text-gray-700">Sucursal</label>
                        <input name="sucursal" value={newPedido.sucursal} onChange={handleInputChange} className="w-full mt-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
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

export default PedidosTable;