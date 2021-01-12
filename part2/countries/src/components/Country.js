import React from 'react';

const Languages = ({languages}) => (
  <ul>
    {languages.map(language => <li key={language.iso639_2}>{language.name}</li>)}
  </ul>
)

const Flag = ({country}) => {
  const alt = `Flag of ${country.name}`
  return (
    <img src={country.flag} alt={alt} widht='400' height='300'></img>
  )
}

const Country = ({country}) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <div>Capital: {country.capital}</div>
      <div>Population: {country.population}</div>
      <h3>Languages</h3>
      <Languages languages={country.languages} />
      <Flag country={country} />
    </div>
  )
}

export default Country