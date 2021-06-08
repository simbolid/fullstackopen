require('dotenv').config()
const express = require('express')
const morgan = require('morgan') // logging middleware
const Person = require('./models/person') // mongoose model

const app = express()

// parse requests containing JSON payloads
app.use(express.json())

// upon receiving GET request, check if build directory contains a file
// corresponding to request address
app.use(express.static('build'))  

// HTTP request logging 
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


/* Route Handlers */

// retrieve all entries
app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => response.json(people))
})

// retrieve single entry
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(note => { response.json(note) })
    .catch(error => {
      console.log(error)
      response.status(404).end() // 404 not found
    })
})

// retrieve phonebook info: number of people, datetime
app.get('/info', (request, response) => {
  Person.count({}, (err, count) => {
    response.send(`<p>Phonebook has info for ${count} people</p> ${new Date()}`)
  })
})

/*
// delete an entry
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id) 
  persons = persons.filter(person => person.id !== id)
  response.status(204).end() // 204 no content
}) */ 

// add an entry
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) 
    return response.status(400).json({ // 400 bad request
      error: 'data must include both name and number'
    })
  
  /*
  if (persons.some(person => person.name === body.name))
    return response.status(400).json({
      error: 'name must be unique'
    }) */
  
  const person = new Person({
    name: body.name, 
    number: body.number
  })

  person.save().then(savedPerson => response.json(savedPerson))
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})