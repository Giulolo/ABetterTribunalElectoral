import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const facturaDetalle = await prisma.facturaDetalle.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        factura: {
          include: {
            cedulacion: true
          }
        },
        servicio: true
      }
    });

    if (!facturaDetalle) {
      return NextResponse.json({ error: 'Factura detalle no encontrado' }, { status: 404 });
    }

    return NextResponse.json(facturaDetalle);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetch factura detalle' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { 
      cantidad,
      precioUnitario
    } = body;

    const subtotal = parseFloat(precioUnitario) * parseInt(cantidad);

    const facturaDetalle = await prisma.facturaDetalle.update({
      where: { id: parseInt(params.id) },
      data: {
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
      where: { id: facturaDetalle.facturaId },
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
        where: { id: facturaDetalle.facturaId },
        data: {
          subtotal: newSubtotal,
          total: newTotal
        }
      });
    }

    return NextResponse.json(facturaDetalle);
  } catch (error) {
    return NextResponse.json({ error: 'Error en modificar factura detalle' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const facturaDetalle = await prisma.facturaDetalle.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!facturaDetalle) {
      return NextResponse.json({ error: 'Factura detalle no encontrado' }, { status: 404 });
    }

    const facturaId = facturaDetalle.facturaId;

    await prisma.facturaDetalle.delete({
      where: { id: parseInt(params.id) }
    });

    const factura = await prisma.factura.findUnique({
      where: { id: facturaId },
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
        where: { id: facturaId },
        data: {
          subtotal: newSubtotal,
          total: newTotal
        }
      });
    }

    return NextResponse.json({ message: 'Factura detalle eliminado exitosamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting factura detalle' }, { status: 500 });
  }
}