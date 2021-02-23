const express = require('express')
const morgan = require('morgan') // logging middleware

const app = express()
app.use(express.json())
app.use(morgan('tiny'))

let persons = [
  { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456",
    
  },
  { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523",
  },
  { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345",
    
  },
  { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122",
  }
]

// retrieve all entries
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// retrieve single entry
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id) // request ID is a string, server stores ID as int 
  const person = persons.find(person => person.id === id)
  console.log(person)
  if (person) 
    response.json(person)
  else 
    response.status(404).end() // 404 not found
})

// delete an entry
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id) 
  console.log(`DELETE request for ID ${id}`)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end() // 204 no content
}) 

// retrieve phonebook info: number of people, datetime
app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p> ${new Date()}`)
})

// add an entry
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) 
    return response.status(400).json({ // 400 bad request
      error: 'data must include both name and number'
    })
  
  if (persons.some(person => person.name === body.name))
    return response.status(400).json({
      error: 'name must be unique'
    })
  
  const person = {
    id: generateId(), 
    name: body.name, 
    number: body.number
  }
  console.log(person)
  persons = persons.concat(person)
  response.json(person)
})

// generate a unique ID number between 1 and 1000
const generateId = () => {
  let id = 1
  do {
    id = Math.ceil(Math.random() * 1000);
  } while (persons.some(person => person.id === id)) // ensure uniqueness
  return id
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

