import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cedulaciones = await prisma.cedulacion.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tribunal: true,
        facturas: true
      }
    });
    return NextResponse.json(cedulaciones);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetch cedulaciones' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
      estado = 'pendiente'
    } = body;

    const cedulacion = await prisma.cedulacion.create({
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

    return NextResponse.json(cedulacion, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creando cedulacion' }, { status: 500 });
  }
}