import React from 'react'

import classes from './Button.css'

const Button = (props) => {
  return (
    <button className={props.isDisabled}
      style={props.style}
      onClick={props.onClick}>
      {props.text}
    </button>
  )
}

export default Button
