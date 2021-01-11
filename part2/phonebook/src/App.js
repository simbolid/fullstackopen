import React, { useState } from 'react'
import Form from './components/Form'
import Persons from './components/Persons'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')

  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} has already been added to the phonebook`)
    } 
    else {
      const newPerson = {
        name: newName, 
        number: newNumber
      }
      setPersons(persons.concat(newPerson))
    }
  }

  return (
    <>
      <h2>Phonebook</h2>
      <h3>Add Contact</h3>
      <Form handleSubmit={handleSubmit} newName={newName} newNumber={newNumber} 
            handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} />
      <h3>Filter</h3>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
    </>
  )
}

export default App