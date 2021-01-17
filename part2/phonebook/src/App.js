import React, { useState, useEffect } from 'react'
import Form from './components/Form'
import Persons from './components/Persons'
import Filter from './components/Filter'
import contactService from './services/contactService'

const App = () => {
  const [ contacts, setContacts ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')

  // get initial phonebook contacts from db.json 
  useEffect(() => {
    contactService
      .getAll()
      .then(contacts => setContacts(contacts))
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDelete = (event) => {
    const name = event.target.value

    if (window.confirm(`Remove ${name}?`)) {
      const toDelete = contacts.filter(contact => contact.name === name)[0]
      const newContacts = contacts.filter(contact => contact.name !== name)
      contactService._delete(toDelete).then(() => setContacts(newContacts)) 
    } 
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newContact = {
      name: newName, 
      number: newNumber
    }

    if (newName === '' || newNumber === '') {
      alert('Fill in both fields before submitting')
    }
    else if (contacts.some(contact => contact.name === newName)) {
      const person = contacts.filter(contact => contact.name === newName)[0]
      if (person.number === newNumber) {
        alert(`${newName} already has that number`)
      } 
      else {
        if (window.confirm(`Update ${person.name}'s number?`)) {
          // update number 
          contactService
            .update(person.id, newContact).then(returnedContact => {
              setContacts(contacts.map(contact => contact.id === person.id ? returnedContact : contact))
              setNewName('')
              setNewNumber('')
            })
        }
      }
    } 
    else {
      contactService
        .create(newContact)
        .then(contact => {
          setContacts(contacts.concat(contact))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  return (
    <>
      <h2>Phonebook</h2>
      <h3>Add Contact</h3>
      <Form handleSubmit={handleSubmit} newName={newName} newNumber={newNumber} 
            handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h3>Contacts</h3>
      <Persons persons={contacts} filter={filter} handleDelete={handleDelete} />
      <h3>Filter</h3>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
    </>
  )
}

export default App