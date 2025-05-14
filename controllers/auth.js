import express from 'express'
import User from '../models/user.js'
import { Unauthorized, UnprocessableEntity } from '../utils/errors.js'
import errorHandler from '../middleware/errorHandler.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

// * Routes
router.post('/register', async (req, res) => {
  console.log('BODY:', req.body)
  try {
    // 1. Check passwords match
    if (req.body.password !== req.body.passwordConfirmation) {
      throw new UnprocessableEntity('Passwords do not match', 'password')
    }
    // 2. Hash the password
    req.body.password = bcrypt.hashSync(req.body.password)

    // 3. Attempting to create the user
    const user = await User.create(req.body)

    // 4. Send success response
    return res.status(201).json({ message: `Welcome ${user.username}` })
  } catch (error) {
    errorHandler(error, res)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. Search for the user by its email
    const userToLogin = await User.findOne({ email })
    
    // 2. If not found, throw Unauthorized
    if (!userToLogin) {
      console.log('User was not found')
      throw new Unauthorized()
    }

    // 3. If it is found, compare the passwords

    // 4. If they don't match, Unauthorized
    if (!bcrypt.compareSync(password, userToLogin.password)) {
      console.log('Passwords do not match')
      throw new Unauthorized()
    }

    // 5. If they match, create a JWT
    const payload = { 
      user: {
        _id: userToLogin._id,
        username: userToLogin.username
      }
    }
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '2d' })

    // 6. Send it back in the response
    return res.json({ token })
  } catch (error) {
    errorHandler(error, res)
  }
})


export default router