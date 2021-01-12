import React, {useState, useEffect} from 'react';
import axios from 'axios'
import Countries from './components/Countries'

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ filter, setFilter ] = useState('')

  // get country data from restcountries.eu
  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => setCountries(response.data))
  }, [])

  const handleFilterChange = (event) => setFilter(event.target.value)

  return (
    <>
      <h2>Find countries</h2>
      <div>
        <input value={filter} onChange={handleFilterChange}/>
      </div>
      <Countries countries={countries} filter={filter} />
    </>
  )
}

export default App;
