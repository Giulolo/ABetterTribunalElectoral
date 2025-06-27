import { NextApiRequest, NextApiResponse } from 'next'
import { crearCedulacion } from '../../queries'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const {
      nombre_completo,
      cedula_original,
      fecha_nacimiento,
      lugar_nacimiento,
      genero,
      foto_url,
      tribunal_id,
      observaciones
    } = req.body

    if (!nombre_completo || !fecha_nacimiento || !lugar_nacimiento || !genero || !tribunal_id) {
      return res.status(400).json({ 
        message: 'Faltan campos requeridos' 
      })
    }

    // Validar género
    if (!['Masculino', 'Femenino', 'Otro'].includes(genero)) {
      return res.status(400).json({ 
        message: 'Género inválido' 
      })
    }

    const resultado = await crearCedulacion({
      nombreCompleto: nombre_completo,
      cedulaOriginal: cedula_original,
      fechaNacimiento: new Date(fecha_nacimiento),
      lugarNacimiento: lugar_nacimiento,
      genero: genero,
      fotoUrl: foto_url,
      tribunalId: parseInt(tribunal_id),
      observaciones
    })

    res.status(201).json({
      message: 'Solicitud de cedulación creada exitosamente',
      data: resultado
    })
  } catch (error) {
    console.error('Error creating cedulacion:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}