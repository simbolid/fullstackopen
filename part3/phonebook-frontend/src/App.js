import React, { useState, useEffect } from 'react'
import Form from './components/Form'
import Persons from './components/Persons'
import Filter from './components/Filter'
import Notification from './components/Notification'
import contactService from './services/contactService'

const App = () => {
  const [ contacts, setContacts ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ isError, setIsError ] = useState(false)

  // get initial phonebook contacts 
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
      const toDelete = contacts.find(contact => contact.name === name)
      const newContacts = contacts.filter(contact => contact.name !== name)

      contactService._delete(toDelete).then(() => setContacts(newContacts))
      .catch(() => setContacts(newContacts)) 
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
      const person = contacts.find(contact => contact.name === newName)

      if (person.number === newNumber) {
        alert(`${newName} already has that number`)
      } 
      else {
        if (window.confirm(`Update ${person.name}'s number?`)) { 
          // display confirmation message through the Notification component
          contactService
            .update(person.id, newContact).then(returnedContact => {
              setContacts(contacts.map(contact => contact.id === person.id ? returnedContact : contact))
              setIsError(false)
              setMessage(`Changed ${returnedContact.name}'s number to ${returnedContact.number}`)
              setTimeout(() => setMessage(null), 5000)
              setNewName('')
              setNewNumber('')
            })
            // display error message
            .catch((error) => {
              console.log(error.response)
              setIsError(true)
              if (error.response.status === 400) { // 400 bad request
                setMessage(error.response.data.error)
              } else {
                setMessage(`The server does not contain ${person.name}'s data`)
                setContacts(contacts.filter(contact => contact.id !== person.id))
              }
              setTimeout(() => {
                setIsError(false)
                setMessage(null)      
              }, 5000)
            })
        }
      }
    } 
    else {
      contactService
        .create(newContact)
        .then(contact => {
          setContacts(contacts.concat(contact))
          setIsError(false)
          setMessage(`Added ${contact.name}`)
          setTimeout(() => setMessage(null), 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch((error) => {
          setIsError(true)
          setMessage(error.response.data.error)
          setTimeout(() => {
            setIsError(false)
            setMessage(null)      
          }, 5000)
        })
    }
  }

  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={message} isError={isError}/>
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