import { NextApiRequest, NextApiResponse } from 'next'
import { getEstadisticas } from '../queries'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const estadisticas = await getEstadisticas()
    res.status(200).json(estadisticas)
  } catch (error) {
    console.error('Error fetching estadisticas:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}