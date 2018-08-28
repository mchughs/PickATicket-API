import React, {Component} from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment'

import classes from './CalendarPicker.css'

class CalendarPicker extends Component {
  render(props) {
    const soldOutDays = []
    const availableDays = []

    for (let i = 0; i < 6; i++) {
      const nextDay = moment().add(i, "days")
      soldOutDays.push(nextDay);
    }

    for (let i = 0; i < 20; i++) {
      const nextDay = moment().add(i + 6, "days")
      availableDays.push(nextDay);
    }

    const highlightWithRanges = [
      { "react-datepicker__day--highlighted-custom-2": availableDays },
      { "react-datepicker__day--highlighted-custom-1": soldOutDays }
    ]

    return (
      <div className={classes.CalendarPicker}>
        <div className={classes.CalendarPicker}>
          <text>Select your desired show date:</text>
          <DatePicker
            selected={this.props.showDate}
            onChange={(date) => this.props.setShowDate(date)}
            minDate={this.props.queryDate}
            highlightDates={highlightWithRanges}
            dateFormat="YYYY-MM-DD" />
        </div>
        <div className={classes.CalendarPicker}>
          {/*
            <text>Time Machine:</text>
          <DatePicker
            selected={this.props.queryDate}
            onChange={(date) => this.props.setQueryDate(date)}
            dateFormat="YYYY-MM-DD" />
            */}
        </div>
      </div>
    )
  }
}

export default CalendarPicker
