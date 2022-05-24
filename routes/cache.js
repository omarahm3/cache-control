const express = require('express')
const router = express.Router()

const CacheController = require('../controllers/cache.controller.js')

router.get('/:key', CacheController.getCacheByKey)

router.get('/', CacheController.getAllStoredKeys)

router.post('/', CacheController.createOrUpdateCache)

router.delete('/:key', CacheController.removeCacheByKey)

module.exports = router
