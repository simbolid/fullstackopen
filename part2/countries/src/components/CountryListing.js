import React, { useState } from 'react'
import Country from './Country'

const CountryListing = (props) => {
  const [showCountry, setShowCountry] = useState(false)

  const listing = 
    <div>
      {props.country.name}
      <button onClick={() => setShowCountry(!showCountry)}> 
        {showCountry ? 'hide' : 'show'}
      </button>
    </div>
      
  if (showCountry) 
    return (
      <>
        {listing}
        <Country key={props.country.alpha3Code} country={props.country} />
      </>
    )

  return listing 
} 
 
export default CountryListing