export enum EstatusPedido {
  Pendiente = 'Pendiente',
  EnProceso = 'En Proceso',
  Entregado = 'Entregado',
  Cancelado = 'Cancelado',
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
