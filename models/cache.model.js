const { Schema, model } = require('mongoose')
const config = require('../config')

const CacheSchema = new Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
    ttl: { type: Number, default: Date.now() + config.defaultTtl },
}, { timestamps: true })

module.exports = model('Cache', CacheSchema)
