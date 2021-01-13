import React from 'react'
import CountryListing from './CountryListing'
import Country from './Country'
import Weather from './Weather'

const Countries = (props) => {
  const countries = props.countries
  const filter = props.filter
  const matches = countries.filter(country => country.name.toLowerCase().includes(filter))

  if (matches.length > 10) 
    return <div>Too many matches, specify another filter</div>
  else if (matches.length === 1) 
    return (
      <>
        <Country country={matches[0]} />
        <Weather country={matches[0]} />
      </>
    ) 
  else 
    return matches.map(country => <CountryListing key={country.alpha3Code} country={country} />)
}

export default Countries