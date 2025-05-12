import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import 'dotenv/config'

// Routers/Controllers
import authRouter from './controllers/auth.js'

const app = express()
const port = process.env.PORT

// * Middleware
app.use(express.json()) // Parses JSON bodies to req.body
app.use(morgan('dev'))

// * Routers
app.use('/api', authRouter)

// * 404 Route
app.use('/{*any}', (req, res) => {
  return res.status(404).json({ message: 'Route not found' })
})

// * Connect to servers
const startServers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`🔒 DB connection established`)
    app.listen(port, () => console.log(`🚀 Server running and listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}
startServers()