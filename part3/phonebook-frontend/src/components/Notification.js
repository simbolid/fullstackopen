import React from 'react'
import './notification.css'

const Notification = ({ message, isError }) => {

  const style = isError ? 'error' : 'message'

  if (message === null)
    return null
  
  return (
    <div className={style}>
      {message}
    </div>
  ) 
}
 
export default Notification