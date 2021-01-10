import React from 'react';
 
const Header = ({course}) => (
  <h2>
    {course.name}
  </h2>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Content = (props) => {
  const parts = props.course.parts
  return (
    <>
      {parts.map(part => 
          <Part key={part.id} part={part} />
      )}
    </>
  )
}

const Total = (props) => { 
  const parts = props.course.parts 
  const sum = parts.map(part => part.exercises)
                   .reduce((accumulator, currentValue) => accumulator + currentValue)
  
  return (
    <p>
      <b>total of {sum} exercises</b>
    </p>
  )
}

const Course = (props) => {
  const course = props.course
  return (
    <>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </>
  );
}

export default Course; 