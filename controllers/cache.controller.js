const { uuid } = require('uuidv4')
const Cache = require('../models/cache.model')
const cacheService = require('../services/cache.service')

exports.getCacheByKey = async (req, res) => {
  const { key } = req.params

  try {
    const { hit, value } = await cacheService.handleGetCacheByKey(key, uuid)
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
