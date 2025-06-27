import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const servicio = await prisma.servicio.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!servicio) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }

    return NextResponse.json(servicio);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetch servicio' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { nombre, descripcion, precio, tipoServicio, activo } = body;

    const servicio = await prisma.servicio.update({
      where: { id: parseInt(params.id) },
      data: {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        tipoServicio,
        activo
      }
    });

    return NextResponse.json(servicio);
  } catch (error) {
    return NextResponse.json({ error: 'Error en modificar servicio' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.servicio.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({ message: 'Servicio eliminado exitosamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error borrando servicio' }, { status: 500 });
  }
}