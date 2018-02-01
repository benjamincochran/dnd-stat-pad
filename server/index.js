import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import bodyParser from 'body-parser';
import RateLimit  from 'express-rate-limit';
import { Nuxt, Builder } from 'nuxt'

import api from './api'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)
app.use(bodyParser.json())
app.use(helmet())
app.use(cors({
  origin: 'https://dnd-stat-pad.herokuapp.com'
}))

if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
}
var apiLimiter = new RateLimit({
  windowMs: 1*60*1000, // 1 minutes
  max: 20,
  delayMs: 0 // disabled
})

app.use('/api', apiLimiter)
app.use('/api', api)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
