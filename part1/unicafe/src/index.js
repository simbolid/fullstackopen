import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({name}) => <h1>{name}</h1>

const Button = ({onclick, text}) => (
  <button onClick={onclick}>
    {text}
  </button>
)

const Statistics = (props) => {
  const total = props.good + props.neutral + props.bad
  const avg = (props.good - props.bad) / total
  const pos = (props.good / total) * 100 + ' %' 

  if (total === 0)
    return <p>No feedback given</p>

  return (
    <table>
      <tbody>
        <Statistic text='good' value={props.good}/>
        <Statistic text='neutral' value={props.neutral}/>
        <Statistic text='bad' value={props.bad}/>
        <Statistic text='all' value={total}/>
        <Statistic text='average' value={avg} />
        <Statistic text='positive' value={pos} />
      </tbody>
    </table>
  )
}

const Statistic = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <Header name='give feedback' />
      <Button onclick={() => setGood(good + 1)} text='good' />
      <Button onclick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onclick={() => setBad(bad + 1)} text='bad' />
      <Header name='statistics' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
