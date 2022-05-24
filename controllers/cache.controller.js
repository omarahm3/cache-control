const { uuidv4 } = require('uuidv4')
const Cache = require('../models/cache.model')
const cacheService = require('../services/cache.service')

exports.getCacheByKey = async (req, res) => {
  const { key } = req.params

  try {
    const { hit, value } = await cacheService.handleGetCacheByKey(key, uuidv4)
    return res.send(value)
  } catch (error) {
    console.log(error)
    return res.sendstatus(500)
  }
}

exports.getAllStoredKeys = async (req, res) => {
  const keys = await cacheService.getAllStoredKeys()
  return res.send(keys)
}

exports.createOrUpdateCache = async (req, res) => {
  const { key, value } = req.body
  const newValue = await cacheService.createOrUpdateCache(key, value)
  return res.send(newValue)
}

exports.removeCacheByKey = async (req, res) => {
  const { key } = req.params
  const result = await cacheService.removeKey(key)

  if (!result) {
    return res.status(404).json({
      success: false,
      message: `key [${key}] does not exist`,
    })
  }
  
  return res.json({
    success: true,
    message: `key [${key}] was removed`
  })
}
