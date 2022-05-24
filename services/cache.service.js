const Cache = require('../models/cache.model')

module.exports = {
  handleGetCacheByKey: async (key, randomGenerator) => {
    const existingCache = await Cache.findOne({ key })

    if (existingCache) {
      console.log('Cache hit')

      return {
        hit: true,
        value: existingCache.value,
      }
    }

    console.log('Cache miss')

    const value = randomGenerator()
    const cache = new Cache({ key, value })
    await cache.save()

    return {
      hit: false,
      value,
    }
  },
  getAllStoredKeys: async () => {
    const data = await Cache.find()
    return data.map((d) => d.key)
  },
  createOrUpdateCache: async (key, value) => {
    await Cache.updateOne({ key }, { $set: { value } }, { upsert: true })
    const record = await Cache.findOne({ key })
    return record.value
  },
  removeKey: async (key) => {
    // Call remove directly without checking first to avoid 2 db calls
    const result = await Cache.remove({ key })

    // Return true if at least 1 record was removed
    return result.deletedCount > 0
  }
}
