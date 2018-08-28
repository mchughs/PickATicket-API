import React from 'react'
import _ from 'lodash'

import TableHeader from '../TableHeader/TableHeader'
import TableRow from '../TableRow/TableRow'
import classes from './Table.css'

const Table = (props) => {
  const basePrice = props.genre === 'MUSICAL' ?
    70 : props.genre === 'COMEDY' ?
    50 :
    40

  const rows = _.orderBy(props.shows, ['tickets_left', 'status'], ['desc', 'desc'])
    .map((show, i) => {
      return (
        <TableRow key={i}
          title={show.title}
          openingNight={show.opening_night}
          ticketsLeft={show.tickets_left}
          ticketsAvailable={show.tickets_available}
          status={show.status}
          basePrice={basePrice}
          showDate={props.showDate}
          />
      )
    });

  return (
    <div className={classes.Table}>
      <text>{props.genre}</text>
      <table>
        <TableHeader />
        {rows}
      </table>
    </div>
  )
}

export default Table
