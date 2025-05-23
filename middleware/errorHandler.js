// This function will be responsible for identifying the type of error that has been thrown and sending the relevant error response
export default function errorHandler(err, res) {
  // Log the error
  console.log(err)

  let { name, status, field = 'message', message, code, kind } = err

  // * ValidationError
  if (name === 'ValidationError'){
    const fields = Object.keys(err.errors)
    const responseBody = {}
    fields.forEach(field => {
      responseBody[field] = err.errors[field].message
    })
    return res.status(422).json(responseBody)
  }

  // * Unique field constraint error
  if (name === 'MongoServerError' && code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    // Send a unique constraint error
    return res.status(422).json({ [field]: `${field} is already taken` })
  }

  // * JsonWebTokenError
  if (name === 'JsonWebTokenError' || name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // * Invalid ObjectId Syntax
  if (name === 'CastError' && kind === 'ObjectId') {
    return res.status(422).json({ message: 'Invalid ObjectId' })
  }
  
  // * All custom error responses
  return res.status(status || 500).json({ [field]: message })
}