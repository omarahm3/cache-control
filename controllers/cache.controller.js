const { v4 } = require('uuid')
const Cache = require('../models/cache.model')
const cacheService = require('../services/cache.service')

exports.getCacheByKey = async (req, res) => {
  const { key } = req.params

  try {
    const { hit, value } = await cacheService.handleGetCacheByKey(key, v4)
    return res.json(value)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

exports.getAllStoredKeys = async (req, res) => {
  const keys = await cacheService.getAllStoredKeys()
  return res.json(keys)
}

exports.createOrUpdateCache = async (req, res) => {
  const { key, value } = req.body
  const newValue = await cacheService.createOrUpdateCache(key, value)
  return res.status(201).json(newValue)
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
