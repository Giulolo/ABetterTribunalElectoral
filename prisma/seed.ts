import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  await prisma.facturaDetalle.deleteMany();
  await prisma.factura.deleteMany();
  await prisma.cedulacion.deleteMany();
  await prisma.tribunal.deleteMany();
  await prisma.servicio.deleteMany();

  const servicios = await prisma.servicio.createMany({
    data: [
      // Servicios de cedulación
      {
        nombre: 'Carné de residente permanente primera vez',
        descripcion: 'Carné de residente permanente primera vez',
        precio: 0.0,
        tipoServicio: 'cedulacion',
      },
      {
        nombre: 'Cédula primera vez',
        descripcion: 'Cédula primera vez',
        precio: 0.0,
        tipoServicio: 'cedulacion',
      },
      {
        nombre: 'Cédula naturalizado por primera vez',
        descripcion: 'Cédula naturalizado por primera vez',
        precio: 50.0,
        tipoServicio: 'cedulacion',
      },
      {
        nombre: 'Eliminación de apellido de casada',
        descripcion: 'Eliminación de apellido de casada',
        precio: 25.0,
        tipoServicio: 'cedulacion',
      },
      {
        nombre: 'Cédula por cambio de nombre',
        descripcion: 'Cédula por cambio de nombre',
        precio: 25.0,
        tipoServicio: 'cedulacion',
      },
      {
        nombre: 'Duplicado nacional cambio de nombre',
        descripcion: 'Duplicado nacional cambio de nombre',
        precio: 25.0,
        tipoServicio: 'cedulacion',
      },
      {
        nombre: 'Duplicado nacional corrección de apellido',
        descripcion: 'Duplicado nacional corrección de apellido',
        precio: 25.0,
        tipoServicio: 'cedulacion',
      },
      {
        nombre: 'Duplicado nacional cambio de firma',
        descripcion: 'Duplicado nacional cambio de firma',
        precio: 25.0,
        tipoServicio: 'cedulacion',
      },
      {
        nombre: 'Duplicado nacional corrección de lugar de nacimiento',
        descripcion: 'Duplicado nacional corrección de lugar de nacimiento',
        precio: 25.0,
        tipoServicio: 'cedulacion',
      },
      {
        nombre: 'Duplicado nacional corrección de fecha de nacimiento',
        descripcion: 'Duplicado nacional corrección de fecha de nacimiento',
        precio: 25.0,
        tipoServicio: 'cedulacion',
      },
      {
        nombre: 'Duplicado emancipado nacional cambio de nombre',
        descripcion: 'Duplicado emancipado nacional cambio de nombre',
        precio: 25.0,
        tipoServicio: 'cedulacion',
      },
      {
        nombre: 'Duplicado emancipado nacional cambio de apellido',
        descripcion: 'Duplicado emancipado nacional cambio de apellido',
        precio: 25.0,
        tipoServicio: 'cedulacion',
      },
      {
        nombre: 'Duplicado emancipado nacional cambio de lugar de nacimiento',
        descripcion:
          'Duplicado emancipado nacional cambio de lugar de nacimiento',
        precio: 25.0,
        tipoServicio: 'cedulacion',
      },
      // Certificados
      {
        nombre: 'Certificado de Nacimiento',
        descripcion: 'Certificado de Nacimiento',
        precio: 5.0,
        tipoServicio: 'certificado',
      },
      {
        nombre: 'Certificado de Matrimonio',
        descripcion: 'Certificado de Matrimonio',
        precio: 5.0,
        tipoServicio: 'certificado',
      },
      {
        nombre: 'Certificado de Defunción (sin causa de muerte)',
        descripcion: 'Certificado de Defunción (sin causa de muerte)',
        precio: 3.0,
        tipoServicio: 'certificado',
      },
      {
        nombre: 'Certificado de Naturalización',
        descripcion: 'Certificado de Naturalización',
        precio: 5.0,
        tipoServicio: 'certificado',
      },
    ],
  });

  const tribunales = await prisma.tribunal.createMany({
    data: [
      // Tribunal Electoral
      {
        nombre: 'Tribunal Electoral Central',
        provincia: 'Panamá',
        direccion: 'Ciudad de Panamá',
        tipoEstablecimiento: 'tribunal',
        horarioAtencion: 'Lunes-Viernes 8:00am-5:00pm',
      },
      // Ubicaciones REY
      {
        nombre: 'REY Vía España',
        provincia: 'Panamá',
        direccion: 'Vía España',
        tipoEstablecimiento: 'rey',
        horarioAtencion: 'Lunes-Sábado 8:00am-8:00pm, Domingos Cerrado',
      },
      {
        nombre: 'REY El Dorado',
        provincia: 'Panamá',
        direccion: 'El Dorado',
        tipoEstablecimiento: 'rey',
        horarioAtencion: 'Lunes-Sábado 8:00am-8:00pm, Domingos Cerrado',
      },
      {
        nombre: 'REY Calle 50',
        provincia: 'Panamá',
        direccion: 'Calle 50',
        tipoEstablecimiento: 'rey',
        horarioAtencion: 'Lunes-Sábado 8:00am-8:00pm, Domingos Cerrado',
      },
      {
        nombre: 'REY 12 de Octubre',
        provincia: 'Panamá',
        direccion: '12 de Octubre',
        tipoEstablecimiento: 'rey',
        horarioAtencion: 'Lunes-Sábado 8:00am-8:00pm, Domingos Cerrado',
      },
      {
        nombre: 'REY Chorrera',
        provincia: 'Panamá Oeste',
        direccion: 'Chorrera',
        tipoEstablecimiento: 'rey',
        horarioAtencion: 'Lunes-Sábado 8:00am-8:00pm, Domingos Cerrado',
      },
      {
        nombre: 'REY David',
        provincia: 'Chiriquí',
        direccion: 'David',
        tipoEstablecimiento: 'rey',
        horarioAtencion: 'Lunes-Sábado 8:00am-8:00pm, Domingos Cerrado',
      },
      {
        nombre: 'REY Santiago',
        provincia: 'Veraguas',
        direccion: 'Santiago',
        tipoEstablecimiento: 'rey',
        horarioAtencion: 'Lunes-Sábado 8:00am-8:00pm, Domingos Cerrado',
      },
      {
        nombre: 'REY Penonomé',
        provincia: 'Coclé',
        direccion: 'Penonomé',
        tipoEstablecimiento: 'rey',
        horarioAtencion: 'Lunes-Sábado 8:00am-8:00pm, Domingos Cerrado',
      },
      // Ubicaciones ROMERO
      {
        nombre: 'ROMERO Barrio Bolívar',
        provincia: 'Panamá',
        direccion: 'Barrio Bolívar',
        tipoEstablecimiento: 'romero',
        horarioAtencion: 'Lunes-Sábado 8:00am-8:00pm, Domingos Cerrado',
      },
      {
        nombre: 'ROMERO Boquete',
        provincia: 'Chiriquí',
        direccion: 'Boquete',
        tipoEstablecimiento: 'romero',
        horarioAtencion: 'Lunes-Sábado 8:00am-8:00pm, Domingos Cerrado',
      },
      {
        nombre: 'ROMERO La Riviera',
        provincia: 'Panamá',
        direccion: 'La Riviera',
        tipoEstablecimiento: 'romero',
        horarioAtencion: 'Lunes-Sábado 8:00am-8:00pm, Domingos Cerrado',
      },
    ],
  });

  console.log('Creando ejemplos de cedulaciones...');

  const firstTribunal = await prisma.tribunal.findFirst();

  if (firstTribunal) {
    const sampleCedulaciones = await prisma.cedulacion.createMany({
      data: [
        {
          nombreCompleto: 'Juan Carlos Pérez',
          fechaNacimiento: new Date('1990-05-15'),
          lugarNacimiento: 'Ciudad de Panamá',
          genero: 'Masculino',
          tribunalId: firstTribunal.id,
          fechaEntregaEstimada: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          estado: 'pendiente',
        },
        {
          nombreCompleto: 'María Elena González',
          fechaNacimiento: new Date('1985-08-22'),
          lugarNacimiento: 'David, Chiriquí',
          genero: 'Femenino',
          tribunalId: firstTribunal.id,
          fechaEntregaEstimada: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          estado: 'en_proceso',
        },
        {
          nombreCompleto: 'Roberto Antonio Silva',
          fechaNacimiento: new Date('1978-12-03'),
          lugarNacimiento: 'Santiago, Veraguas',
          genero: 'Masculino',
          tribunalId: firstTribunal.id,
          fechaEntregaEstimada: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          estado: 'listo',
          cedulaNueva: '8-123-4567',
        },
      ],
    });
    console.log('creado hecho: ', sampleCedulaciones);

    console.log('Creando ejemplo de facturas...');

    const cedulaciones = await prisma.cedulacion.findMany();
    const firstServicio = await prisma.servicio.findFirst();

    if (cedulaciones.length > 0 && firstServicio) {
      for (const cedulacion of cedulaciones.slice(0, 2)) {
        const factura = await prisma.factura.create({
          data: {
            cedulacionId: cedulacion.id,
            numeroFactura: `FAC-${new Date().getFullYear()}${String(
              new Date().getMonth() + 1,
            ).padStart(2, '0')}${String(new Date().getDate()).padStart(
              2,
              '0',
            )}-${String(cedulacion.id).padStart(6, '0')}`,
            subtotal: firstServicio.precio,
            total: firstServicio.precio,
            estadoPago: 'pendiente',
          },
        });

        await prisma.facturaDetalle.create({
          data: {
            facturaId: factura.id,
            servicioId: firstServicio.id,
            cantidad: 1,
            precioUnitario: firstServicio.precio,
            subtotal: firstServicio.precio,
          },
        });
      }
    }
  }

  console.log('Database completo hecho!');

  // Log
  const counts = {
    servicios: await prisma.servicio.count(),
    tribunales: await prisma.tribunal.count(),
    cedulaciones: await prisma.cedulacion.count(),
    facturas: await prisma.factura.count(),
    facturaDetalles: await prisma.facturaDetalle.count(),
  };

  console.log('Record creado:', counts);

  console.log('servicios: ', servicios, 'tribunales: ', tribunales);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
