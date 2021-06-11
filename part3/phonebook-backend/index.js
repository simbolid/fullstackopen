require('dotenv').config()
const express = require('express')
const morgan = require('morgan') // logging middleware
const Person = require('./models/person') // mongoose model

const app = express()

// upon receiving GET request, check if build directory contains a file
// corresponding to request address
app.use(express.static('build'))  

// parse requests containing JSON payloads
app.use(express.json())

// HTTP request logging 
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


/* Route Handlers */

// retrieve all entries
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(people => response.json(people))
    .catch(error => next(error))
})

// retrieve single entry
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => person ? response.json(person) : response.status(404).end()) // if person not found, return 404 not found 
    .catch(error => next(error))
})

// retrieve phonebook info: number of people, datetime
app.get('/info', (request, response, next) => {
  Person.count({}, (err, count) => {
    response.send(`<p>Phonebook has info for ${count} people</p> ${new Date()}`)
  })
  .catch(error => next(error))
})

// delete an entry
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(person => person ? response.json(person) : response.status(404).end())  
    .catch(error => next(error))
})  

// add an entry
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) 
    return response.status(400).json({ // 400 bad request
      error: 'data must include both name and number'
    })
  
  const person = new Person({
    name: body.name, 
    number: body.number
  })

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

// update an entry
app.put('/api/persons/:id', (request, response, next) => {
  const update = { number: request.body.number }

  Person.findByIdAndUpdate(request.params.id, update, { new: true } ) // new option: return updated note
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

/* End route handlers */

// see https://mongoosejs.com/docs/api/error.html for mongoose error types
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'malformatted id' }) // 400 bad request 

  next(error) // call express' default error handler 
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})