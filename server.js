const express = require('express')
const cors = require('cors')
const Moralis = require('moralis').default
const PORT = process.env.PORT || 3000
require('dotenv').config()

// ENV vars
const MORALIS_API_KEY = process.env.MORALIS_API_KEY

const app = express()

// set static folder
app.use(express.static('public'))

// routes
app.use('/token-holders', require('./routes/token-holders'))
app.use('/token-balance', require('./routes/token-balance'))
app.use('/snapshot-api', require('./routes/snapshot-api'))

// eneble cors
app.use(cors())

Moralis.start({
  apiKey: MORALIS_API_KEY
}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
})
