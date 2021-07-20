const { v4: uuidv4 } = require('uuid')

require('../resources/db/connection')()

const SecretModel = require('../resources/db/models/Secret')

const draw = require('../utils/draw')

module.exports.create = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const { name, email } = JSON.parse(event.body)
  const adminKey = uuidv4()
  const externalId = uuidv4()

  try {
    await SecretModel.create({
      owner: name,
      ownerEmail: email,
      adminKey,
      externalId,
    })

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        success: true,
        id: externalId,
        adminKey,
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body:  JSON.stringify({
        success: false,
      }),
    }
  }
}

module.exports.get = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const { id: externalId } = event.pathParameters
   const incommingAdminKey = event.headers['admin-key']

  try {
    const { participants, adminKey, drawResult } = await SecretModel.findOne({
      externalId,
    }).select('-_id participants adminKey drawResult').lean()

    const isAdmin = !!(incommingAdminKey && incommingAdminKey === adminKey)

    const result = {
      participants,
      hasDrew: !!drawResult.length,
      isAdmin,
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result)
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body:  JSON.stringify({
        success: false,
      }),
    }
  }
}

module.exports.draw = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const { id: externalId } = event.pathParameters
  const adminKey = event.headers['admin-key']

  try {
    const secret = await SecretModel.findOne({
      externalId,
      adminKey,
    }).select('participants ownerEmail').lean()

    if (!secret) {
      throw newError()
    }

    const drawResult = draw(secret.participants)
    const drawMap = drawResult.map((result) => {
      return {
        giver: result.giver.externalId,
        receiver: result.receiver.externalId,
      }
    })

    await SecretModel.updateOne(
      {
        _id: secret._id,
      },
      {
        drawResult: drawMap,
      }
    )

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        drawResult,
        success: true,

      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body:  JSON.stringify({
        success: false,
      }),
    }
  }
}