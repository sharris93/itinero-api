import serverless from 'serverless-http'
import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import 'dotenv/config'
import cors from 'cors'

// Routers/Controllers
import authRouter from '../../controllers/auth.js'
import activityRouter from '../../controllers/activities.js'

const app = express()

// * Middleware
app.use(express.json())
app.use(cors()) // Enable CORS on all origins - used to consume the API from a react app
app.use(morgan('dev'))

// * Routers
app.use('/api', authRouter)
app.use('/api', activityRouter)

// * 404 Route
app.use('/{*any}', (req, res) => {
  return res.status(404).json({ message: 'Route not found' })
})

// * Connect to servers
const startServers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
  } catch (error) {
    console.log(error)
  }
}
startServers()

export const handler = serverless(app, {
  request: (req, event) => {
    if (typeof event.body === 'string') {
      try {
        req.body = JSON.parse(event.body);
      } catch (err) {
        req.body = {};
      }
    }
  }
});