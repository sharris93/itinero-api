import { Unauthorized } from "../utils/errors.js"
import errorHandler from "./errorHandler.js"
import jwt from 'jsonwebtoken'
import User from "../models/user.js"

export default async function isSignedIn(req, res, next) {
  try {

    req.myNewField = 'Hello World'

    // 1. Verify the authorization header is present on the request
    const authHeader = req.headers.authorization
    if (!authHeader) {
      console.log('Missing headers')
      throw new Unauthorized()
    }

    const token = authHeader.split(' ')[1]

    // 2. Verify the token
    const { user } = jwt.verify(token, process.env.TOKEN_SECRET)

    // 3. Handle the JsonWebTokenError inside the errorHandler

    // 4. Verify that the user in the token payload still exists
    const userToVerify = await User.findById(user._id)

    // 5. Unauthorized if user doesn't exist
    if (!userToVerify) {
      console.log('User no longer exists')
      throw new Unauthorized()
    }

    // 6. If the user exists, pass the user to the next middleware controller
    req.user = userToVerify

    // 7. Move to controller
    next()

  } catch (error) {
    errorHandler(error, res)
  }
}