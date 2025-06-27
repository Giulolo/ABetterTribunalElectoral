import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // const servicios = await prisma.servicio.findMany({
    //   orderBy: { createdAt: 'desc' }
    // });
    const servicios = await prisma.servicio.findMany({
      orderBy: [{ createdAt: 'desc' }],
      where: {
        activo: true,
      }
    });
    return NextResponse.json(servicios);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetch servicios' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, descripcion, precio, tipoServicio, activo = true } = body;

    if (!nombre || !precio || !tipoServicio) {
      return NextResponse.json(
        { error: 'Requiere campos: nombre, precio, tipoServicio' },
        { status: 400 }
      );
    }

    const servicio = await prisma.servicio.create({
      data: {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        tipoServicio,
        activo,
      },
    });

    return NextResponse.json(servicio, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creando servicio' },
      { status: 500 },
    );
  }
}
