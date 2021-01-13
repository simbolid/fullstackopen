import React, {useState, useEffect} from 'react'
import axios from 'axios'

const Weather = (props) => {
  const [weather, setWeather] = useState() // initial state undefined
  
  const getWeatherData = () => {
    const params = {
      access_key: process.env.REACT_APP_API_KEY.trim(),
      query: props.country.name
    }
    axios.get('http://api.weatherstack.com/current', {params})
    .then(response => {
      console.log(response.data)
      setWeather(response.data.current)
    }).catch(error => {
      console.log(error);
    })
  }

  useEffect(getWeatherData, [props.country.name])

  if (!weather) // avoids errors from trying to access undefined data
    return <p>Loading...</p>

  return (
    <div>
      <h3>Weather in {props.country.capital}</h3>
      <img src={weather.weather_icons[0]} alt='weather icon' />
      <div><b>Temperature: </b>{weather.temperature} ℃</div>
      <div><b>Wind: </b>{weather.wind_speed} km/h {weather.wind_dir}</div>
    </div>
  )
}
 
export default Weather