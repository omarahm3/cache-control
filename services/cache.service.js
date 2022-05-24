const Cache = require('../models/cache.model')
const config = require('../config')

const expiredTtl = (cache) => {
  return cache && Date.now() - cache.ttl > config.defaultTtl
}

module.exports = {
  handleGetCacheByKey: async (key, randomGenerator) => {
    const existingCache = await Cache.findOne({ key })

    if (expiredTtl(existingCache)) {
      await Cache.deleteOne({ key })
    } else if (existingCache) {
      console.log('Cache hit')
      existingCache.ttl = Date.now() + config.defaultTtl
      await existingCache.save()

      return {
        hit: true,
        value: existingCache.value,
      }
    }

    console.log('Cache miss')

    const currentCacheSize = await Cache.countDocuments()
    const value = randomGenerator()

    if (currentCacheSize >= config.maximumCacheSize) {
      // override oldest cache
      const oldestCache = await Cache.findOne().sort({ updatedAt: -1 })
      oldestCache.key = key
      oldestCache.value = value
      oldestCache.ttl = Date.now() + config.defaultTtl
      await oldestCache.save()
    } else {
      const cache = new Cache({ key, value })
      await cache.save()
    }

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
    const result = await Cache.deleteOne({ key })

    // Return true if at least 1 record was removed
    return result.deletedCount > 0
  },
  removeAllKeys: async () => {
    const result = await Cache.deleteMany({})
    return result.deletedCount > 0
  }
}
