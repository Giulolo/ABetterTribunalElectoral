import { NextApiRequest, NextApiResponse } from 'next'
import { getTribunales } from '../queries'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const tribunales = await getTribunales()
    res.status(200).json(tribunales)
  } catch (error) {
    console.error('Error fetching tribunales:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}