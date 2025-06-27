export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  tipoServicio: string;
}

export interface Tribunal {
  id: number;
  nombre: string;
  provincia: string;
  direccion: string;
  telefono: string;
}

export interface Cedulacion {
  id: number;
  nombreCompleto: string;
  cedulaOriginal: string;
  fechaNacimiento: string;
  lugarNacimiento: string;
  genero: string;
  tribunal: Tribunal;
}

export interface FacturaDetalle {
  id: number;
  servicioId: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  servicio: Servicio;
}

export interface Factura {
  id: number;
  numeroFactura: string;
  subtotal: number;
  impuestos: number;
  total: number;
  estadoPago: string;
  metodoPago: string;
  fechaPago: string;
  createdAt: string;
  cedulacion: Cedulacion;
  facturaDetalles: FacturaDetalle[];
}
