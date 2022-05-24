const mongoSetup = require('@shelf/jest-mongodb/setup')

module.exports = async() => {
  // Setup mongo url
  await mongoSetup()
  const url = process.env.MONGO_URL

  if (url == null) {
    throw new Error('MONGO_URL was not set')
  }
}
