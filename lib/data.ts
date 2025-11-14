
import { 
  Pedido, EstatusPedido, Precio, Cliente, 
  Logistica, Personal, EstatusConfig, 
  Turno, Sucursal, FormaDePago, Repartidor, Zona, ClienteConfig, Producto, Perfil
} from './types';

export const initialPedidos: Pedido[] = [
  { id: 'ORD-001', folio: 'F-A123', cliente: 'Oficina Central', fcompra: '2023-10-26', fentrega: '2023-10-30', estatus: EstatusPedido.Entregado, turno: 'Matutino', sucursal: 'Centro', repartidor: 'Juan Pérez', producto: 'Ramo de 24 Rosas Rojas' },
  { id: 'ORD-002', folio: 'F-B456', cliente: 'Tech Solutions', fcompra: '2023-10-27', fentrega: '2023-11-05', estatus: EstatusPedido.Preparacion, turno: 'Vespertino', sucursal: 'Norte', repartidor: 'Ana Gómez', producto: 'Arreglo de Girasoles' },
  { id: 'ORD-003', folio: 'F-C789', cliente: 'Clean Co.', fcompra: '2023-10-28', fentrega: '2023-11-02', estatus: EstatusPedido.EnEspera, turno: 'Matutino', sucursal: 'Sur', repartidor: 'Carlos Sánchez', producto: 'Orquídea Phalaenopsis' },
  { id: 'ORD-004', folio: 'F-D012', cliente: 'Diseño Interior Mx', fcompra: '2023-10-29', fentrega: '2023-11-10', estatus: EstatusPedido.Cancelado, turno: 'Nocturno', sucursal: 'Centro', repartidor: 'Juan Pérez', producto: 'Ramo de 24 Rosas Rojas' },
  { id: 'ORD-005', folio: 'F-E345', cliente: 'Café del Esquina', fcompra: '2023-11-01', fentrega: '2023-11-03', estatus: EstatusPedido.EnTransito, turno: 'Matutino', sucursal: 'Norte', repartidor: 'Ana Gómez', producto: 'Arreglo de Girasoles' },
  { id: 'ORD-006', folio: 'F-F678', cliente: 'Librería El Saber', fcompra: '2023-11-02', fentrega: '2023-11-04', estatus: EstatusPedido.Regresado, turno: 'Vespertino', sucursal: 'Sur', repartidor: 'Carlos Sánchez', producto: 'Orquídea Phalaenopsis' },
];

export const initialPrecios: Precio[] = [
  { id: 'PRC-001', folio: 'Venta mayoreo', cliente: 'Tech Distributors', estatus: EstatusPedido.Entregado, fentrega: '2023-11-05', fPago: 'PayPal', precio: 1200, envio: 50, costo: 800, ganancia: 400, producto: 'Laptop Stand', sku: 'LS-001' },
  { id: 'PRC-002', folio: 'Venta menudeo', cliente: 'Innovate Corp', estatus: EstatusPedido.EnEspera, fentrega: '2023-11-12', fPago: 'Stripe', precio: 150, envio: 20, costo: 90, ganancia: 60, producto: 'Mousepad', sku: 'MP-005' },
  { id: 'PRC-003', folio: 'Factura a crédito', cliente: 'Office Supplies Inc.', estatus: EstatusPedido.Cancelado, fentrega: '2023-10-20', fPago: 'Depósito', precio: 5000, envio: 150, costo: 3500, ganancia: 1500, producto: 'Silla Ergonómica', sku: 'SE-002' },
];

export const initialClientes: Cliente[] = [
  { id: 'CLI-001', folio: 'F-CL-01', estatus: EstatusPedido.Entregado, fentrega: '2023-12-01', cliente: 'Global Imports', correo: 'contact@globalimports.com', telefono: '555-0101', destinatario: 'Almacén Central', telDestino: '555-0102' },
  { id: 'CLI-002', folio: 'F-CL-02', estatus: EstatusPedido.Cancelado, fentrega: '2023-11-15', cliente: 'Creative Minds', correo: 'hello@creativeminds.dev', telefono: '555-0201', destinatario: 'Oficina de Proyectos', telDestino: '555-0202' },
  { id: 'CLI-003', folio: 'F-CL-03', estatus: EstatusPedido.EnEspera, fentrega: '2024-01-10', cliente: 'Futura Tech', correo: 'info@futuratech.io', telefono: '555-0301', 'destinatario': 'Gerencia', 'telDestino': '555-0302' },
];

export const initialLogistica: Logistica[] = [
  { id: 'LOG-001', folio: 'F-L-01', estatus: EstatusPedido.EnTransito, fentrega: '2023-12-10', cliente: 'Global Imports', repartidor: 'Juan Pérez', pais: 'México', estado: 'Jalisco', ciudad: 'Guadalajara', codigoPostal: '44100', colonia: 'Centro', calle: 'Av. Juárez 123', referencias: 'Edificio de cristal, puerta negra' },
  { id: 'LOG-002', folio: 'F-L-02', estatus: EstatusPedido.Entregado, fentrega: '2023-11-25', cliente: 'Creative Minds', repartidor: 'Ana Gómez', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey', codigoPostal: '64000', colonia: 'Del Valle', calle: 'Calzada del Valle 456', referencias: 'Frente al parque' },
  { id: 'LOG-003', folio: 'F-L-03', estatus: EstatusPedido.EnEspera, fentrega: '2023-12-20', cliente: 'Futura Tech', repartidor: 'Carlos Sánchez', pais: 'México', estado: 'CDMX', ciudad: 'Ciudad de México', codigoPostal: '06000', colonia: 'Roma Norte', calle: 'Orizaba 789', referencias: 'Portón de madera' },
];

export const initialPersonal: Personal[] = [
  { id: 'PER-001', folio: 'FP-001', estatus: EstatusPedido.EnTransito, fentrega: '2023-12-15', cliente: 'Global Imports', dedicatoria: 'Para el mejor equipo, con aprecio.', notas: 'Entregar en recepción.' },
  { id: 'PER-002', folio: 'FP-002', estatus: EstatusPedido.Preparacion, fentrega: '2023-12-22', cliente: 'Creative Minds', dedicatoria: 'Felices fiestas y próspero año nuevo.', notas: 'Confirmar diseño antes de imprimir.' },
  { id: 'PER-003', folio: 'FP-003', estatus: EstatusPedido.EnEspera, fentrega: '2024-01-05', cliente: 'Futura Tech', dedicatoria: 'Gracias por su preferencia.', notas: 'Cliente solicitará muestra física.' },
];


// --- DATOS DE CONFIGURACIÓN ---

export const initialEstatusConfig: EstatusConfig[] = [
    { id: 1, nombre: EstatusPedido.EnEspera, descripcion: 'El pedido ha sido recibido pero aún no se ha procesado.', notificaciones: { push: true, sms: false, email: true } },
    { id: 2, nombre: EstatusPedido.Preparacion, descripcion: 'El pedido se está preparando en la sucursal.', notificaciones: { push: true, sms: true, email: true } },
    { id: 3, nombre: EstatusPedido.EnTransito, descripcion: 'El repartidor ya recogió el pedido y se dirige al destino.', notificaciones: { push: true, sms: true, email: true } },
    { id: 4, nombre: EstatusPedido.Entregado, descripcion: 'El pedido ha sido entregado exitosamente al destinatario.', notificaciones: { push: true, sms: false, email: true } },
    { id: 5, nombre: EstatusPedido.Cancelado, descripcion: 'El pedido ha sido cancelado por el cliente o la florería.', notificaciones: { push: true, sms: false, email: true } },
    { id: 6, nombre: EstatusPedido.Regresado, descripcion: 'El pedido no pudo ser entregado y fue regresado a la sucursal.', notificaciones: { push: false, sms: false, email: true } },
];

export const initialTurnos: Turno[] = [
    { id: 'T-01', nombre: 'Matutino', horario: '06:00 a 15:00' },
    { id: 'T-02', nombre: 'Vespertino', horario: '15:00 a 20:00' },
    { id: 'T-03', nombre: 'Nocturno', horario: '20:00 a 02:00' },
];

export const initialSucursales: Sucursal[] = [
    { id: 'SUC-01', nombre: 'Centro', telefono: '55-1234-5678', pais: 'México', estado: 'CDMX', ciudad: 'Cuauhtémoc', colonia: 'Centro Histórico', calle: 'Madero 10, Piso 2', mapsUrl: 'https://goo.gl/maps/example1' },
    { id: 'SUC-02', nombre: 'Norte', telefono: '55-2345-6789', pais: 'México', estado: 'CDMX', ciudad: 'Gustavo A. Madero', colonia: 'Lindavista', calle: 'Av. Politécnico 20', mapsUrl: 'https://goo.gl/maps/example2' },
    { id: 'SUC-03', nombre: 'Sur', telefono: '55-3456-7890', pais: 'México', estado: 'CDMX', ciudad: 'Coyoacán', colonia: 'Del Carmen', calle: 'Allende 30', mapsUrl: 'https://goo.gl/maps/example3' },
];

export const initialFormasDePago: FormaDePago[] = [
    { id: 1, nombre: 'Stripe' },
    { id: 2, nombre: 'Paypal' },
    { id: 3, nombre: 'Depósito' },
];

export const initialRepartidores: Repartidor[] = [
    { id: 'REP-001', repartidor_id: 'R-01', nombre: 'Juan Pérez', telefono: '55-9876-5432', marca: 'Nissan', modelo: 'March', placas: 'ABC-123' },
    { id: 'REP-002', repartidor_id: 'R-02', nombre: 'Ana Gómez', telefono: '55-8765-4321', marca: 'Italika', modelo: 'DS150', placas: 'XYZ-456' },
];

export const initialZonas: Zona[] = [
    { id: 'Z-01', pais: 'México', estado: 'Ciudad de México', ciudad: 'Venustiano Carranza' },
    { id: 'Z-02', pais: 'México', estado: 'Jalisco', ciudad: 'Guadalajara' },
    { id: 'Z-03', pais: 'México', estado: 'Nuevo León', ciudad: 'Monterrey' },
];

export const initialClientesConfig: ClienteConfig[] = [
    { id: 'CLI-001', nombre: 'Global Imports', telefono: '555-0101', correo: 'contact@globalimports.com', ventas: 25, montoTotal: 75200.50, pedidos: 28 },
    { id: 'CLI-002', nombre: 'Creative Minds', telefono: '555-0201', correo: 'hello@creativeminds.dev', ventas: 12, montoTotal: 32500.00, pedidos: 15 },
    { id: 'CLI-003', nombre: 'Futura Tech', telefono: '555-0301', correo: 'info@futuratech.io', ventas: 5, montoTotal: 12800.75, pedidos: 6 },
];

export const initialProductos: Producto[] = [
    { id: 'PROD-001', nombre: 'Ramo de 24 Rosas Rojas', sku: 'RAM-ROS-01', ingredientes: '24 Rosas rojas, follaje, listón', categoria: 'Ramos', precioVenta: 750.00, color: 'Rojo', descripcionCorta: 'Clásico ramo de rosas rojas para expresar amor.', imagenUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?Text=Rosas' },
    { id: 'PROD-002', nombre: 'Arreglo de Girasoles', sku: 'ARR-GIR-01', ingredientes: '12 Girasoles, base de cerámica, follaje', categoria: 'Arreglos Florales', precioVenta: 900.00, color: 'Amarillo', descripcionCorta: 'Arreglo vibrante para alegrar el día.', imagenUrl: 'https://via.placeholder.com/150/FFFF00/000000?Text=Girasol' },
    { id: 'PROD-003', nombre: 'Orquídea Phalaenopsis', sku: 'PLA-ORQ-01', ingredientes: '1 Orquídea Phalaenopsis, maceta de cristal', categoria: 'Plantas', precioVenta: 1200.00, color: 'Blanco', descripcionCorta: 'Planta elegante y de larga duración.', imagenUrl: 'https://via.placeholder.com/150/FFFFFF/000000?Text=Orquidea' },
];

export const initialPerfil: Perfil = {
  nombreFloreria: 'Florería El Jardín de Venus',
  telefono: '55-1122-3344',
  whatsapp: '5215511223344',
  correo: 'ventas@jardindevenus.com',
  pais: 'México',
  estado: 'Ciudad de México',
  ciudad: 'Coyoacán',
  colonia: 'Del Carmen',
  calle: 'Av. Hidalgo 123, Local A',
  mapsUrl: 'https://goo.gl/maps/perfilexample'
};