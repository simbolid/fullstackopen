import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Header = ({name}) => <h1>{name}</h1>

const Button = ({onclick, text}) => (
  <button onClick={onclick}>
    {text}
  </button>
)

const Votes = ({votes}) => (
  <p>has {votes} votes</p>
)

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(props.anecdotes.length).fill(0))

  const indexOfMax = points.indexOf(Math.max(...points))

  const handleNextVote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }

  // Note: defining rand outside of handNextClick() causes the program to freeze
  // when rand equals the current value of selected
  const handleNextClick = () => {
    const rand = Math.floor(Math.random() * props.anecdotes.length)
    setSelected(rand)
  }
  
  return (
    <>
      <Header name='Anecdote of the day' />
      {props.anecdotes[selected]}
      <Votes votes={points[selected]}/>
      <Button onclick={handleNextVote} text='vote' />
      <Button onclick={handleNextClick} text='next' />

      <Header name='Anecdote with most votes' />
      {props.anecdotes[indexOfMax]}
    </>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)