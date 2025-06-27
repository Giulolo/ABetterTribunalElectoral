import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const facturaDetalles = await prisma.facturaDetalle.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        factura: {
          include: {
            cedulacion: true
          }
        },
        servicio: true
      }
    });
    return NextResponse.json(facturaDetalles);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetch factura detalles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      facturaId,
      servicioId,
      cantidad = 1,
      precioUnitario
    } = body;

    const subtotal = parseFloat(precioUnitario) * parseInt(cantidad);

    const facturaDetalle = await prisma.facturaDetalle.create({
      data: {
        facturaId: parseInt(facturaId),
        servicioId: parseInt(servicioId),
        cantidad: parseInt(cantidad),
        precioUnitario: parseFloat(precioUnitario),
        subtotal
      },
      include: {
        factura: true,
        servicio: true
      }
    });

    const factura = await prisma.factura.findUnique({
      where: { id: parseInt(facturaId) },
      include: {
        facturaDetalles: true
      }
    });

    if (factura) {
      const newSubtotal = factura.facturaDetalles.reduce((sum, detalle) => 
        sum + parseFloat(detalle.subtotal.toString()), 0
      );
      const newTotal = newSubtotal + parseFloat(factura.impuestos.toString());

      await prisma.factura.update({
        where: { id: parseInt(facturaId) },
        data: {
          subtotal: newSubtotal,
          total: newTotal
        }
      });
    }

    return NextResponse.json(facturaDetalle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creando factura detalle' }, { status: 500 });
  }
}
