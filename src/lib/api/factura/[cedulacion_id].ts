import { NextApiRequest, NextApiResponse } from 'next'
import { getFacturaPorCedulacion } from '../../queries'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cedulacion_id } = req.query

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const cedulacionId = parseInt(cedulacion_id as string)
    if (isNaN(cedulacionId)) {
      return res.status(400).json({ message: 'ID inválido' })
    }

    const factura = await getFacturaPorCedulacion(cedulacionId)
    
    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada' })
    }

    res.status(200).json(factura)
  } catch (error) {
    console.error('Error fetching factura:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}