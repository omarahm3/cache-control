const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config')

const cacheRouter = require('./routes/cache')

const app = express()

mongoose.connect(config.mongoURI)

const db = mongoose.connection

db.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/api/cache', cacheRouter)

db.once('open', () => {
    console.log('Connected to database')
    app.listen(config.port, () => {
        console.log('Server is up and running on port numner ' + config.port)
    })
})
