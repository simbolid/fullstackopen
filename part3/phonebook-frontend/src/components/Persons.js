import React from 'react';

const Person = (props) => (
  <div>
    {props.person.name} {props.person.number} <button value={props.person.name} onClick={props.handleDelete}>delete</button>
  </div>
)

const Persons = (props) => {
  const persons = props.persons
  const filter = props.filter.toLowerCase()
  return (
    persons.filter(person => person.name.toLowerCase().includes(filter))
           .map(person => <Person key={person.name} person={person} handleDelete={props.handleDelete} />)
  )
}
  
export default Persons