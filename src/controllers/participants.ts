import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid'
import SecretModel from '../resources/db/models/Secret';

export default class ParticipantsController {
  async create(request: Request, response: Response) {
    const { id: secretId } = request.params
    const { name, email } = request.body
    
    const externalId = uuidv4()
    
    const validateUniqueEmailInEvent = { $ne: email }
    
    try {
      const result = await SecretModel.updateOne({
          externalId: secretId,
          'participants.email': validateUniqueEmailInEvent
      },{
        $push: {
          participants : {
            externalId,
            name,
            email
          }
        }
      })
  
      if (!result.nModified) {
        return response.status(500).json({ success: false, error: 'E-mail ja cadastrado!' })
      }

      return response.status(201).json({
        success: true,
        id: externalId,
      })
    } catch (error) {
      console.log('ERROR', error)
      return response.status(500).json({ success: false, error: error })
    }
  }
  async deleteParticipant(request: Request, response: Response) {
    const { id: secretId, participantId } = request.params
    const adminKey = request.headers['admin-key']

    try {
      const result = await SecretModel.updateOne(
        {
          externalId: secretId,
          adminKey: String(adminKey),
        },
        {
          $pull: {
            participants: {
              externalId: participantId,
            }
          }
        }
      )

      if (!result.nModified) {
        throw new Error()
      }

      return response.status(204).json({ success: true }) 
    } catch (error) {
      console.log('ERROR', error)
      return response.status(500).json({ success: false, error: error })
      
    }
  }
}