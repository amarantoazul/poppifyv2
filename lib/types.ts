

export type View = 
  | 'Kanban'
  | 'Pedidos' 
  | 'Precios' 
  | 'Clientes' 
  | 'Logística' 
  | 'Personal'
  | 'Configuración-Estatus'
  | 'Configuración-Turnos'
  | 'Configuración-Sucursal'
  | 'Configuración-Formas de Pago'
  | 'Configuración-Reparto'
  | 'Configuración-Zonas'
  | 'Configuración-Clientes'
  | 'Configuración-Productos'
  | 'Configuración-Perfil';

export enum EstatusPedido {
  EnEspera = 'En Espera',
  Preparacion = 'Preparación',
  EnTransito = 'En Tránsito',
  Entregado = 'Entregado',
  Cancelado = 'Cancelado',
  Regresado = 'Regresado',
}

export interface Pedido {
  id: string;
  folio: string;
  cliente: string;
  fcompra: string;
  fentrega: string;
  estatus: EstatusPedido;
  turno: string;
  sucursal: string;
  repartidor: string;
  producto: string;
}

export interface Precio {
  id: string;
  folio: string;
  estatus: EstatusPedido; // <- Unificado
  fentrega: string;
  cliente: string;
  fPago: string;
  precio: number;
  envio: number;
  costo: number;
  ganancia: number;
  producto: string;
  sku: string;
}

export interface Cliente {
  id: string;
  folio: string;
  estatus: EstatusPedido; // <- Unificado
  fentrega: string;
  cliente: string;
  correo: string;
  telefono: string;
  destinatario: string;
  telDestino: string;
}

export interface Logistica {
  id: string;
  folio: string;
  estatus: EstatusPedido; // <- Unificado
  fentrega: string;
  cliente: string;
  repartidor: string;
  pais: string;
  estado: string;
  ciudad: string;
  codigoPostal: string;
  colonia: string;
  calle: string;
  referencias: string;
}

export interface Personal {
  id: string;
  folio: string;
  estatus: EstatusPedido; // <- Unificado
  fentrega: string;
  cliente: string;
  dedicatoria: string;
  notas: string;
}

// --- CONFIGURACIÓN ---

export interface EstatusConfig {
  id: number;
  nombre: EstatusPedido;
  descripcion: string;
  notificaciones: {
    push: boolean;
    sms: boolean;
    email: boolean;
  };
}

export interface Turno {
  id: string;
  nombre: string;
  horario: string;
}

export interface Sucursal {
  id: string;
  nombre: string;
  telefono: string;
  pais: string;
  estado: string;
  ciudad: string;
  colonia: string;
  calle: string;
  mapsUrl: string;
}

export interface FormaDePago {
  id: number;
  nombre: string;
}

export interface Repartidor {
  id: string;
  repartidor_id: string;
  nombre: string;
  telefono: string;
  marca: string;
  modelo: string;
  placas: string;
}

export interface Zona {
  id: string;
  pais: string;
  estado: string;
  ciudad: string;
}

export interface ClienteConfig {
    id: string;
    nombre: string;
    telefono: string;
    correo: string;
    ventas: number;
    montoTotal: number;
    pedidos: number;
}

export interface Producto {
  id: string;
  nombre: string;
  sku: string;
  ingredientes: string;
  categoria: string;
  precioVenta: number;
  color: string;
  descripcionCorta: string;
  imagenUrl: string;
}

export interface Perfil {
  nombreFloreria: string;
  telefono: string;
  whatsapp: string;
  correo: string;
  pais: string;
  estado: string;
  ciudad: string;
  colonia: string;
  calle: string;
  mapsUrl: string;
}