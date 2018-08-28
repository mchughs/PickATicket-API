import React, {Component} from 'react'
import moment from 'moment'

import Button from '../Button/Button'
import classes from './TableRow.css'

class TableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amountPurchased: 0
    }
    this.addTicket = this.addTicket.bind(this)
    this.removeTicket = this.removeTicket.bind(this)
  }

  addTicket() {
    this.setState((prevState) => {
      return { amountPurchased : prevState.amountPurchased + 1 };
    });
  }

  removeTicket() {
    this.setState((prevState) => {
      return { amountPurchased : prevState.amountPurchased - 1 };
    });
  }

  render() {
    const addIsDisabled = (this.props.ticketsAvailable - this.state.amountPurchased === 0) ?
      'pure-button-disabled' : ''
    const removeIsDisabled = (this.state.amountPurchased === 0) ?
      'pure-button-disabled' : ''

    const showMoment = moment(this.props.showDate);
    const startMoment = moment(this.props.openingNight);

    const daysSinceStart = moment.duration(showMoment.diff(startMoment)).asDays();

    const priceMultiplier = (daysSinceStart < 80) ? 1 : 0.8

    const pricePer = this.props.basePrice * priceMultiplier

    const total = this.state.amountPurchased !== 0 ?
      pricePer*this.state.amountPurchased + '€' :
      ''

    return (
      <tbody>
        <tr>
          <th>{this.props.title}</th>
          <th>{this.props.ticketsLeft- this.state.amountPurchased}</th>
          <th>{this.props.ticketsAvailable - this.state.amountPurchased}</th>
          <th>{this.props.status}</th>
          <th>{pricePer}</th>
          <th>{total} (⨉{this.state.amountPurchased})</th>
          <th>
            <Button isDisabled={addIsDisabled}
              text={'+'}
              style={{backgroundColor:'rgb(28, 184, 65)'}}
              onClick={this.addTicket}/>
            <Button isDisabled={removeIsDisabled}
              text={'−'}
              style={{backgroundColor:'rgb(202, 60, 60)'}}
              onClick={this.removeTicket}/>
          </th>
        </tr>
      </tbody>
    )
  }
}

export default TableRow
