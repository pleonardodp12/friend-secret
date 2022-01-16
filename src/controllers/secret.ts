import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'
import { draw } from '../utils/draw'
import SecretModel from '../resources/db/models/Secret';

export default class SecretController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body
    const adminKey = uuidv4()
    const externalId = uuidv4()

    try {
      await SecretModel.create({
        owner: name,
        ownerEmail: email,
        adminKey,
        externalId,
      })
      return response.status(201).json({
        success: true,
        id: externalId,
        adminKey,
      })
      
    } catch (error) {
      console.log('ERROR', error)
      return response.status(500).json({ success: false, error: error })
    }
  }

  async get(request: Request, response: Response) {
    const { id: externalId } = request.params
    const incommingAdminKey = request.headers['admin-key']

    try {
      const responseSecret = await SecretModel.findOne({
        externalId,
      }).select('-_id participants adminKey drawResult').lean()
  
      if (!responseSecret) {
        return response.status(500).json({ success: false, error: 'Falha ao tentar achar evento' })
      }

      const isAdmin = !!(incommingAdminKey && incommingAdminKey === responseSecret.adminKey)
  
      const result = {
        participants: responseSecret.participants,
        hasDrew: !!responseSecret.drawResult.length,
        isAdmin,
      }

      return response.status(200).json({
        success: true,
        result,
      })
    } catch (error) {
      console.log('ERROR', error)
      return response.status(500).json({ success: false, error: error })
    }
  }

  async drawPost(request: Request, response: Response) {
    const { id: externalId } = request.params
    const adminKey = request.headers['admin-key']

    try {
      const secret = await SecretModel.findOne({
        externalId,
        adminKey: String(adminKey),
      }).select('participants ownerEmail').lean()
  
      if (!secret) {
        return response.status(500).json({ success: false, error: 'Não foi possível encontrar o evento!' })
      }
  
      const drawResult = draw(secret.participants)
      const drawMap = drawResult.map((result) => {
        return {
          giver: result.giver.externalId,
          receiver: result.receiver.externalId,
        }
      })
  
      await SecretModel.updateOne({ _id: secret._id }, {
        drawResult: drawMap as [],
      })

      return response.status(200).json({
        success: true,
        drawResult,
      })
    } catch (error) {
      console.log('ERROR', error)
      return response.status(500).json({ success: false, error: error })
    }
  }
}