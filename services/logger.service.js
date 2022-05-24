const pino = require('pino')

const logger = pino({
  base: {
    pid: false,
  },
  transport: {
    target: 'pino-pretty',
  },
})

module.exports = logger
