// import { NextApiRequest, NextApiResponse } from 'next'
// import { crearFactura, getFacturas } from '../queries'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'GET') {
//     try {
//       const facturas = await getFacturas()
//       res.status(200).json(facturas)
//     } catch (error) {
//       console.error('Error fetching facturas:', error)
//       res.status(500).json({ message: 'Error interno del servidor' })
//     }
//   } else if (req.method === 'POST') {
//     try {
//       const {
//         cedulacion_id,
//         numero_factura,
//         subtotal,
//         impuestos,
//         total,
//         estado_pago,
//         detalles
//       } = req.body

//       // Validaciones básicas
//       if (!cedulacion_id || !numero_factura || !subtotal || !total || !detalles) {
//         return res.status(400).json({ 
//           message: 'Faltan campos requeridos' 
//         })
//       }

//       const resultado = await crearFactura({
//         cedulacionId: parseInt(cedulacion_id),
//         numeroFactura: numero_factura,
//         subtotal: parseFloat(subtotal),
//         impuestos: parseFloat(impuestos || 0),
//         total: parseFloat(total),
//         estadoPago: estado_pago || 'pendiente',
//         detalles: detalles
//       })

//       res.status(201).json({
//         message: 'Factura creada exitosamente',
//         data: resultado
//       })
//     } catch (error) {
//       console.error('Error creating factura:', error)
//       res.status(500).json({ message: 'Error interno del servidor' })
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' })
//   }
// }