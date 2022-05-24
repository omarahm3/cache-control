module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/cache',
  port: process.env.PORT || 3000,
  maximumCacheSize: process.env.MAXIMUM_CACHE_SIZE || 10,
  defaultTtl: process.env.DEFAULT_TTL || 60 * 60 * 5,
}
