export class UnprocessableEntity extends Error {
  constructor(message, field = 'message'){
    // Before we assign keys to the new object
    // We need to fully extend the Error class by running super()
    super(message)
    this.name = 'UnprocessableEntity'
    this.status = 422
    this.field = field
  }
}

export class Unauthorized extends Error {
  constructor(message = 'Unauthorized'){
    super(message)
    this.name = 'Unauthorized'
    this.status = 401
    this.field = 'message'
  }
}

export class NotFound extends Error {
  constructor(message = 'Not Found'){
    super(message)
    this.name = 'NotFound'
    this.status = 404
    this.field = 'message'
  }
}

export class Forbidden extends Error {
  constructor(message = 'You do not have permission to access this resource'){
    super(message)
    this.name = 'Forbidden'
    this.status = 403
    this.field = 'message'
  }
}