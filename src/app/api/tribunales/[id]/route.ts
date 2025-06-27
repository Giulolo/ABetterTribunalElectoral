import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tribunal = await prisma.tribunal.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        cedulaciones: true
      }
    });

    if (!tribunal) {
      return NextResponse.json({ error: 'Tribunal no encontrado' }, { status: 404 });
    }

    return NextResponse.json(tribunal);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetch tribunal' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { 
      nombre, 
      provincia, 
      direccion, 
      telefono, 
      horarioAtencion, 
      tipoEstablecimiento,
      activo 
    } = body;

    const tribunal = await prisma.tribunal.update({
      where: { id: parseInt(params.id) },
      data: {
        nombre,
        provincia,
        direccion,
        telefono,
        horarioAtencion,
        tipoEstablecimiento,
        activo
      }
    });

    return NextResponse.json(tribunal);
  } catch (error) {
    return NextResponse.json({ error: 'Error en modificar tribunal' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tribunal.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({ message: 'Tribunal eliminado exitosamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error borrando tribunal' }, { status: 500 });
  }
}