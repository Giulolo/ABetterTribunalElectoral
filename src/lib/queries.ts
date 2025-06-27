import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTribunales() {
  try {
    const tribunales = await prisma.tribunal.findMany({
      where: {
        activo: true,
      },
      select: {
        id: true,
        nombre: true,
        provincia: true,
        direccion: true,
        tipoEstablecimiento: true,
        horarioAtencion: true,
      },
      orderBy: [{ provincia: 'asc' }, { nombre: 'asc' }],
    });
    return tribunales;
  } catch (error) {
    console.error('Error fetching tribunales:', error);
    throw error;
  }
}

export async function getServicios() {
  try {
    const servicios = await prisma.servicio.findMany({
      where: {
        activo: true,
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio: true,
        tipoServicio: true,
      },
      orderBy: [{ tipoServicio: 'asc' }, { nombre: 'asc' }],
    });
    return servicios;
  } catch (error) {
    console.error('Error fetching servicios:', error);
    throw error;
  }
}

export async function crearCedulacion(data: {
  nombreCompleto: string;
  cedulaOriginal?: string;
  fechaNacimiento: Date;
  lugarNacimiento: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  fotoUrl?: string;
  tribunalId: number;
  observaciones?: string;
}) {
  try {
    const result = await prisma.$transaction(async tx => {
      // Calcular fecha de entrega (7 días después)
      const fechaEntrega = new Date();
      fechaEntrega.setDate(fechaEntrega.getDate() + 7);

      const cedulacion = await tx.cedulacion.create({
        data: {
          nombreCompleto: data.nombreCompleto,
          cedulaOriginal: data.cedulaOriginal,
          fechaNacimiento: data.fechaNacimiento,
          lugarNacimiento: data.lugarNacimiento,
          genero: data.genero,
          fotoUrl: data.fotoUrl,
          tribunalId: data.tribunalId,
          observaciones: data.observaciones,
          fechaEntregaEstimada: fechaEntrega,
        },
      });

      // Buscar servicio "Cédula primera vez"
      const servicioCedula = await tx.servicio.findFirst({
        where: {
          nombre: 'Cédula primera vez',
        },
      });

      if (!servicioCedula) {
        throw new Error('Servicio de cédula primera vez no encontrado');
      }

      // Generar número de factura
      const numeroFactura = `FAC-${new Date().getFullYear()}${String(
        new Date().getMonth() + 1,
      ).padStart(2, '0')}${String(new Date().getDate()).padStart(
        2,
        '0',
      )}-${String(cedulacion.id).padStart(6, '0')}`;

      const factura = await tx.factura.create({
        data: {
          cedulacionId: cedulacion.id,
          numeroFactura: numeroFactura,
          subtotal: servicioCedula.precio,
          total: servicioCedula.precio,
        },
      });

      // Agregar servicio a la factura
      await tx.facturaDetalle.create({
        data: {
          facturaId: factura.id,
          servicioId: servicioCedula.id,
          cantidad: 1,
          precioUnitario: servicioCedula.precio,
          subtotal: servicioCedula.precio,
        },
      });

      return {
        cedulacionId: cedulacion.id,
        numeroFactura: factura.numeroFactura,
        fechaEntrega: cedulacion.fechaEntregaEstimada,
      };
    });

    return result;
  } catch (error) {
    console.error('Error creating cedulacion:', error);
    throw error;
  }
}

export async function getCedulacion(id: number) {
  try {
    const cedulacion = await prisma.cedulacion.findUnique({
      where: { id },
      include: {
        tribunal: {
          select: {
            nombre: true,
            provincia: true,
            direccion: true,
            horarioAtencion: true,
          },
        },
        facturas: {
          include: {
            facturaDetalles: {
              include: {
                servicio: true,
              },
            },
          },
        },
      },
    });
    return cedulacion;
  } catch (error) {
    console.error('Error fetching cedulacion:', error);
    throw error;
  }
}

export async function getFacturaPorCedulacion(cedulacionId: number) {
  try {
    const factura = await prisma.factura.findFirst({
      where: {
        cedulacionId: cedulacionId,
      },
      include: {
        cedulacion: {
          include: {
            tribunal: {
              select: {
                nombre: true,
                direccion: true,
              },
            },
          },
        },
        facturaDetalles: {
          include: {
            servicio: {
              select: {
                nombre: true,
                descripcion: true,
              },
            },
          },
        },
      },
    });

    return factura;
  } catch (error) {
    console.error('Error fetching factura:', error);
    throw error;
  }
}

export async function actualizarEstadoCedulacion(
  id: number,
  estado: 'pendiente' | 'en_proceso' | 'listo' | 'entregado' | 'cancelado',
  cedulaNueva?: string,
) {
  try {
    const cedulacion = await prisma.cedulacion.update({
      where: { id },
      data: {
        estado,
        cedulaNueva,
        updatedAt: new Date(),
      },
    });
    return cedulacion;
  } catch (error) {
    console.error('Error updating cedulacion:', error);
    throw error;
  }
}

export async function getCedulacionesPorTribunal(
  tribunalId: number,
  limite: number = 50,
) {
  try {
    const cedulaciones = await prisma.cedulacion.findMany({
      where: {
        tribunalId: tribunalId,
      },
      include: {
        tribunal: true,
        facturas: {
          select: {
            numeroFactura: true,
            total: true,
            estadoPago: true,
          },
        },
      },
      orderBy: {
        fechaSolicitud: 'desc',
      },
      take: limite,
    });

    // Transformar datos para mantener compatibilidad
    return cedulaciones.map(c => ({
      id: c.id,
      nombre_completo: c.nombreCompleto,
      estado: c.estado,
      fecha_solicitud: c.fechaSolicitud,
      fecha_entrega_estimada: c.fechaEntregaEstimada,
      cedula_nueva: c.cedulaNueva,
      numero_factura: c.facturas[0]?.numeroFactura || null,
      total: c.facturas[0]?.total || null,
      estado_pago: c.facturas[0]?.estadoPago || null,
    }));
  } catch (error) {
    console.error('Error fetching cedulaciones por tribunal:', error);
    throw error;
  }
}

export async function getEstadisticas() {
  try {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);

    const cedulaciones = await prisma.cedulacion.findMany({
      where: {
        createdAt: {
          gte: fechaLimite,
        },
      },
      include: {
        facturas: {
          select: {
            total: true,
            estadoPago: true,
          },
        },
      },
    });

    const estadisticas = {
      totalCedulaciones: cedulaciones.length,
      pendientes: cedulaciones.filter(c => c.estado === 'pendiente').length,
      enProceso: cedulaciones.filter(c => c.estado === 'en_proceso').length,
      listos: cedulaciones.filter(c => c.estado === 'listo').length,
      entregados: cedulaciones.filter(c => c.estado === 'entregado').length,
      ingresosTotales: cedulaciones
        .flatMap(c => c.facturas)
        .filter(f => f.estadoPago === 'pagado')
        .reduce((sum, f) => sum + Number(f.total), 0),
    };

    return estadisticas;
  } catch (error) {
    console.error('Error fetching estadisticas:', error);
    throw error;
  }
}

export { prisma };
