import React from 'react'

import Table from '../Table/Table'
import classes from './Tables.css'

const Tables = (props) => {
  const tables = props.inventory.map((inventoryItem, i) => {
    return <Table key={i}
      genre={inventoryItem.genre}
      shows={inventoryItem.shows}
      showDate={props.showDate}/>
  })

  return (
    <div className={classes.Tables}>
      {tables}
    </div>
  )
}

export default Tables
