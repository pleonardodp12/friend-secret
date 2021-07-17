const mongoose = require('mongoose')

let connect = null

const URI = process.env.URI

module.exports = async () => {
  if (!connect) {
    connect = mongoose.connect(URI, {
      userNewUrlParser: true,
      useCreateIndex: true,
    })

    await connect
  }
}