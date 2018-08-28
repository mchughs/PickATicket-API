import React from 'react'
import moment from 'moment';

import classes from './Banner.css'

const Banner = (props) => {
  return (
    <div className={classes.Banner}>
      <text><strong>Pick-A-Ticket™ today on</strong></text>
      <text>{props.todayDate}</text>
      <text><strong>!!!</strong></text>
    </div>
  )
}

export default Banner
