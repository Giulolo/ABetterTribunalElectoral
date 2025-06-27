import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tribunales = await prisma.tribunal.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { cedulaciones: true }
        }
      }
    });
    return NextResponse.json(tribunales);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetch tribunales' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      nombre, 
      provincia, 
      direccion, 
      telefono, 
      horarioAtencion, 
      tipoEstablecimiento,
      activo = true 
    } = body;

    const tribunal = await prisma.tribunal.create({
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

    return NextResponse.json(tribunal, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creando tribunal' }, { status: 500 });
  }
}