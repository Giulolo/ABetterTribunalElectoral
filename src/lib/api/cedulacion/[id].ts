import { NextApiRequest, NextApiResponse } from 'next'
import { getCedulacion } from '../../queries'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const cedulacionId = parseInt(id as string)
    if (isNaN(cedulacionId)) {
      return res.status(400).json({ message: 'ID inválido' })
    }

    const cedulacion = await getCedulacion(cedulacionId)
    
    if (!cedulacion) {
      return res.status(404).json({ message: 'Cedulación no encontrada' })
    }

    res.status(200).json(cedulacion)
  } catch (error) {
    console.error('Error fetching cedulacion:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}