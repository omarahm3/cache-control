const Cache = require('../models/cache.model')
const logger = require('./logger.service')
const config = require('../config')

const expiredTtl = (cache) => {
  return cache && Date.now() - cache.ttl > config.defaultTtl
}

/**
 * This will handle creating a cache record for a new cache key
 * @param {string} key
 * @param {Function} randomGenerator
 */
const handleCacheMiss = async (key, randomGenerator) => {
  logger.info('Cache miss')

  const currentCacheSize = await Cache.countDocuments()
  const value = randomGenerator()

  // Happy scenario where cache does not exceed the maximum allowed cache size
  if (currentCacheSize < config.maximumCacheSize) {
    // Generate new cache record and save
    // TTL is handled by default for new documents
    const cache = new Cache({ key, value })
    await cache.save()
    return value
  }

  // Cache size is exceeded
  // Get the very oldest cache record using `updatedAt` field
  const oldestCache = await Cache.findOne().sort({ updatedAt: -1 })
  // Update both its key and value
  oldestCache.key = key
  oldestCache.value = value
  // TTL need to be reset again, since this we're overriding an existing record with a new data
  oldestCache.ttl = Date.now() + config.defaultTtl
  // Save the document
  await oldestCache.save()

  return value
}

module.exports = {
  handleGetCacheByKey: async (key, randomGenerator) => {
    // Check if we have a cache for this key
    const existingCache = await Cache.findOne({ key })

    // Check if this cache TTL is expired
    if (expiredTtl(existingCache)) {
      // Remove this cache and continue to cache miss
      await Cache.deleteOne({ key })
    } 
    // Or check if cache exists and TTL is still valid
    else if (existingCache) {
      logger.info('Cache hit')
      // Update the TTL since this is a hit
      existingCache.ttl = Date.now() + config.defaultTtl
      await existingCache.save()

      return {
        hit: true,
        value: existingCache.value,
      }
    }

    const value = await handleCacheMiss(key, randomGenerator)

    return {
      hit: false,
      value,
    }
  },
  getAllStoredKeys: async () => {
    const data = await Cache.find()
    return data.map((d) => ({
      key: d.key,
      value: d.value,
    }))
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
