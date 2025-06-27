import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const facturas = await prisma.factura.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        cedulacion: {
          include: {
            tribunal: true
          }
        },
        facturaDetalles: {
          include: {
            servicio: true
          }
        }
      }
    });
    return NextResponse.json(facturas);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetch facturas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      cedulacionId,
      servicios, // { servicioId, cantidad, precioUnitario }
      estadoPago = 'pendiente',
      metodoPago,
      fechaPago,
      impuestos = 0
    } = body;

    // Generar numero unico
    const timestamp = Date.now();
    const numeroFactura = `FAC-${timestamp}`;

    // Calcular totales
    let subtotal = 0;
    servicios.forEach((servicio: any) => {
      subtotal += parseFloat(servicio.precioUnitario) * parseInt(servicio.cantidad);
    });

    const impuestosAmount = parseFloat(impuestos);
    const total = subtotal + impuestosAmount;

    //para la fecha de pago sea 1 mes despues de fecha creada
     const fechaCreacion = new Date();
    const fechaPagoCalculada = new Date(fechaCreacion);
    fechaPagoCalculada.setMonth(fechaPagoCalculada.getMonth() + 1);

      // Crear detalles de facturas
    const factura = await prisma.$transaction(async (tx) => {
      const newFactura = await tx.factura.create({
        data: {
          cedulacionId: parseInt(cedulacionId),
          numeroFactura,
          subtotal,
          impuestos: impuestosAmount,
          total,
          estadoPago,
          metodoPago,
          fechaPago: fechaPago ? new Date(fechaPago) : fechaPagoCalculada
        }
      });

      for (const servicio of servicios) {
        const subtotalDetalle = parseFloat(servicio.precioUnitario) * parseInt(servicio.cantidad);
        
        await tx.facturaDetalle.create({
          data: {
            facturaId: newFactura.id,
            servicioId: parseInt(servicio.servicioId),
            cantidad: parseInt(servicio.cantidad),
            precioUnitario: parseFloat(servicio.precioUnitario),
            subtotal: subtotalDetalle
          }
        });
      }

      return tx.factura.findUnique({
        where: { id: newFactura.id },
        include: {
          cedulacion: {
            include: {
              tribunal: true
            }
          },
          facturaDetalles: {
            include: {
              servicio: true
            }
          }
        }
      });
    });

    return NextResponse.json(factura, { status: 201 });
  } catch (error) {
    console.error('Error creando factura:', error);
    return NextResponse.json({ error: 'Error creando factura' }, { status: 500 });
  }
}