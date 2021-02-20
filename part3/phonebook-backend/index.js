const express = require('express')
const app = express()

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456",
    
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
  }
]

// retrieve all entries
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// retrieve single entry
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id) // request ID is a string, server stores ID as int 

  console.log(`GET request for ID ${id}`)

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

