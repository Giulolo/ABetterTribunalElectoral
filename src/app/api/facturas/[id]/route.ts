import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const factura = await prisma.factura.findUnique({
      where: { id: parseInt(params.id) },
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

    if (!factura) {
      return NextResponse.json({ error: 'Factura no encontrado' }, { status: 404 });
    }

    return NextResponse.json(factura);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetch factura' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { 
      estadoPago,
      metodoPago,
      fechaPago
    } = body;

    const factura = await prisma.factura.update({
      where: { id: parseInt(params.id) },
      data: {
        estadoPago,
        metodoPago,
        fechaPago: fechaPago ? new Date(fechaPago) : null
      },
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

    return NextResponse.json(factura);
  } catch (error) {
    return NextResponse.json({ error: 'Error en modificar factura' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.$transaction(async (tx) => {
      // Primero borra facturadetalle
      await tx.facturaDetalle.deleteMany({
        where: { facturaId: parseInt(params.id) }
      });
      
      // ;uego borra la factura
      await tx.factura.delete({
        where: { id: parseInt(params.id) }
      });
    });

    return NextResponse.json({ message: 'Factura eliminado exitosamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error borrando factura' }, { status: 500 });
  }
}