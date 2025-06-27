import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cedulacion = await prisma.cedulacion.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        tribunal: true,
        facturas: {
          include: {
            facturaDetalles: {
              include: {
                servicio: true
              }
            }
          }
        }
      }
    });

    if (!cedulacion) {
      return NextResponse.json({ error: 'Cedulacion no encontrado' }, { status: 404 });
    }

    return NextResponse.json(cedulacion);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetch cedulacion' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { 
      nombreCompleto,
      cedulaOriginal,
      fechaNacimiento,
      lugarNacimiento,
      genero,
      fotoUrl,
      tribunalId,
      fechaEntregaEstimada,
      cedulaNueva,
      observaciones,
      estado
    } = body;

    const cedulacion = await prisma.cedulacion.update({
      where: { id: parseInt(params.id) },
      data: {
        nombreCompleto,
        cedulaOriginal,
        fechaNacimiento: new Date(fechaNacimiento),
        lugarNacimiento,
        genero,
        fotoUrl,
        tribunalId: parseInt(tribunalId),
        fechaEntregaEstimada: fechaEntregaEstimada ? new Date(fechaEntregaEstimada) : null,
        cedulaNueva,
        observaciones,
        estado
      },
      include: {
        tribunal: true
      }
    });

    return NextResponse.json(cedulacion);
  } catch (error) {
    return NextResponse.json({ error: 'Error en modificar cedulacion' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.cedulacion.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({ message: 'Cedulacion eliminado exitosamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error borrando cedulacion' }, { status: 500 });
  }
}