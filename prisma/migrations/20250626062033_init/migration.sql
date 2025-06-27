-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('Masculino', 'Femenino', 'Otro');

-- CreateEnum
CREATE TYPE "EstadoCedulacion" AS ENUM ('pendiente', 'en_proceso', 'listo', 'entregado', 'cancelado');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('pendiente', 'pagado', 'cancelado');

-- CreateTable
CREATE TABLE "servicios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "tipo_servicio" VARCHAR(100) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tribunales" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "provincia" VARCHAR(100) NOT NULL,
    "direccion" TEXT,
    "telefono" VARCHAR(20),
    "horario_atencion" VARCHAR(100),
    "tipo_establecimiento" VARCHAR(50),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tribunales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cedulaciones" (
    "id" SERIAL NOT NULL,
    "nombre_completo" VARCHAR(255) NOT NULL,
    "cedula_original" VARCHAR(20),
    "fecha_nacimiento" DATE NOT NULL,
    "lugar_nacimiento" VARCHAR(255) NOT NULL,
    "genero" "Genero" NOT NULL,
    "foto_url" VARCHAR(500),
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoCedulacion" NOT NULL DEFAULT 'pendiente',
    "tribunal_id" INTEGER NOT NULL,
    "fecha_entrega_estimada" DATE,
    "cedula_nueva" VARCHAR(20),
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cedulaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturas" (
    "id" SERIAL NOT NULL,
    "cedulacion_id" INTEGER NOT NULL,
    "numero_factura" VARCHAR(50) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "impuestos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "estado_pago" "EstadoPago" NOT NULL DEFAULT 'pendiente',
    "metodo_pago" VARCHAR(50),
    "fecha_pago" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factura_detalles" (
    "id" SERIAL NOT NULL,
    "factura_id" INTEGER NOT NULL,
    "servicio_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "factura_detalles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facturas_numero_factura_key" ON "facturas"("numero_factura");

-- AddForeignKey
ALTER TABLE "cedulaciones" ADD CONSTRAINT "cedulaciones_tribunal_id_fkey" FOREIGN KEY ("tribunal_id") REFERENCES "tribunales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_cedulacion_id_fkey" FOREIGN KEY ("cedulacion_id") REFERENCES "cedulaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_detalles" ADD CONSTRAINT "factura_detalles_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "facturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura_detalles" ADD CONSTRAINT "factura_detalles_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
