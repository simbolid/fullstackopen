import React from 'react';

const Filter = (props) => (
  <div>
    <input value={props.filter} onChange={props.handleFilterChange} />
  </div>
)
 
export default Filter