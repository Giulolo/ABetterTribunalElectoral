import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json({ 
      message: 'API is working!', 
      timestamp: new Date().toISOString(),
      method: req.method
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    res.status(500).json({ message: 'Test endpoint failed' })
  }
}