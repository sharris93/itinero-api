import Busboy from 'busboy'

// Helper to collect stream data into a string
const collectBody = (req) =>
  new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => (body += chunk.toString()))
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })

const bodyParser = async (req, res, next) => {
  const contentType = req.headers['content-type'] || ''

  try {
    if (contentType.includes('application/json')) {
      const raw = await collectBody(req)
      req.body = JSON.parse(raw)
      return next()

    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const raw = await collectBody(req)
      req.body = Object.fromEntries(new URLSearchParams(raw))
      return next()

    } else if (contentType.includes('multipart/form-data')) {
      const fields = {}
      const busboy = Busboy({ headers: req.headers })

      busboy.on('field', (fieldname, val) => {
        fields[fieldname] = val
      })

      busboy.on('file', (fieldname, file, filename) => {
        // Skip file content for now — just discard it
        file.resume()
      })

      busboy.on('finish', () => {
        req.body = fields
        next()
      })

      req.pipe(busboy)

    } else {
      return res.status(415).json({ error: 'Unsupported content type' })
    }
  } catch (err) {
    return res.status(400).json({ error: 'Malformed request body' })
  }
}

export default bodyParser