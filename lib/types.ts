

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

export enum EstatusPrecio {
  Pagado = 'Pagado',
  Pendiente = 'Pendiente de Pago',
  Vencido = 'Vencido',
}

export interface Precio {
  id: string;
  folio: string;
  estatus: EstatusPrecio;
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

export enum EstatusCliente {
  Activo = 'Activo',
  Inactivo = 'Inactivo',
  Potencial = 'Potencial',
}

export interface Cliente {
  id: string;
  folio: string;
  estatus: EstatusCliente;
  fentrega: string;
  cliente: string;
  correo: string;
  telefono: string;
  destinatario: string;
  telDestino: string;
}

export enum EstatusLogistica {
  EnAlmacen = 'En Almacén',
  EnRuta = 'En Ruta',
  Entregado = 'Entregado',
  Retrasado = 'Retrasado',
}

export interface Logistica {
  id: string;
  folio: string;
  estatus: EstatusLogistica;
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

export enum EstatusPersonal {
  Pendiente = 'Pendiente',
  EnDiseño = 'En Diseño',
  Listo = 'Listo para Entrega',
  Entregado = 'Entregado',
}

export interface Personal {
  id: string;
  folio: string;
  estatus: EstatusPersonal;
  fentrega: string;
  cliente: string;
  dedicatoria: string;
  notas: string;
}

// --- CONFIGURACIÓN ---

export interface EstatusConfig {
  id: number;
  // FIX: Use EstatusPedido enum to enforce consistency with the rest of the app.
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
  nombre: 'Matutino' | 'Vespertino' | 'Nocturno';
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