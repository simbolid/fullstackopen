import React from 'react';

const Person = (props) => (
  <div>{props.person.name} {props.person.number}</div>
)

const Persons = (props) => {
  const persons = props.persons
  const filter = props.filter.toLowerCase()
  return (
    persons.filter(person => person.name.toLowerCase().includes(filter))
           .map(person => <Person key={person.name} person={person} />)
  )
}
  
export default Persons;