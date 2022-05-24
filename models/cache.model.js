const { Schema, model } = require('mongoose')

const CacheSchema = new Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
}, { timestamps: true })

module.exports = model('Cache', CacheSchema)
