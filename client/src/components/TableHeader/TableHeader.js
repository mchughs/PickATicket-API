import React from 'react'

import classes from './TableHeader.css'

const TableHeader = (props) => {
  return (
    <tbody>
      <tr>
        <th>Title</th>
        <th>Tickets Left</th>
        <th>Tickets Available</th>
        <th>Status</th>
        <th>Price per Ticket €</th>
        <th>Total Cost</th>
        <th>{/*Place holder for button*/}</th>
      </tr>
    </tbody>
  )
}

export default TableHeader
