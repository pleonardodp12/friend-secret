const { v4: uuidv4 } = require('uuid')

require('../resources/db/connection')()

const SecretModel = require('../resources/db/models/Secret')

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
      body: JSON.stringify({
        success: true,
        id: externalId,
        adminKey,
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
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
      body: JSON.stringify(result)
    }

  } catch (error) {
    return {
      statusCode: 500,
      body:  JSON.stringify({
        success: false,
      }),
    }
  }
}

module.exports.draw = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {

  } catch (error) {
    return {
      statusCode: 500,
      body:  JSON.stringify({
        success: false,
      }),
    }
  }
}