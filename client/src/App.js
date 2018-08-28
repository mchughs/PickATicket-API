import React, { Component } from 'react';
import { Provider } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import store from './store';

import Banner from './components/Banner/Banner'
import CalendarPicker from './components/CalendarPicker/CalendarPicker'
import Tables from './components/Tables/Tables'

class App extends Component {
  constructor() {
    super();
    this.state = {
      queryDate: moment().format("YYYY-MM-DD"),
      showDate: moment().format("YYYY-MM-DD"),
      inventory: [],
      isFetching: false,
    }
    this.setShowDate = this.setShowDate.bind(this);
    this.setQueryDate = this.setQueryDate.bind(this);
  }

  componentDidMount() {
    this.setState({ isFetching:true });
    // a proxy is set up in the package.json file to avoid CORS errors
    axios.get(`/inventory?queryDate=${this.state.queryDate}&showDate=${this.state.showDate}`)
      .then(res => {
        const inventory = res.data.inventory;
        this.setState({ inventory });
        this.setState({ isFetching:false });
      })
  }

  setShowDate(date) {
    const showDate = date.format("YYYY-MM-DD");
    this.setState({ showDate });
    this.setState({ isFetching:true });
    axios.get(`/inventory?queryDate=${this.state.queryDate}&showDate=${showDate}`)
      .then(res => {
        const inventory = res.data.inventory;
        this.setState({ inventory });
        this.setState({ isFetching:false });
      })
  }

  setQueryDate(date) {
    const queryDate = date.format("YYYY-MM-DD");
    this.setState({ queryDate });
    this.setState({ isFetching:true });
    axios.get(`https://pick-a-ticket.herokuapp.com/inventory?queryDate=${queryDate}&showDate=${this.state.showDate}`)
      .then(res => {
        const inventory = res.data.inventory;
        this.setState({ inventory });
        this.setState({ isFetching:false });
      })
  }

  render() {
    const tables = this.state.isFetching ?
      (<div style={{textAlign:'center'}}><text>Loading...</text></div>) :
      (<Tables inventory={this.state.inventory} showDate={this.state.showDate}/>)

    return (
      <Provider store={store}>
        <div style={{width:'100%'}}>
          <Banner todayDate={this.state.queryDate}/>
          <CalendarPicker
            showDate={moment(this.state.showDate)}
            setShowDate={this.setShowDate}
            queryDate={moment(this.state.queryDate)}
            setQueryDate={this.setQueryDate}/>
          {tables}
        </div>
      </Provider>
    );
  }
}

export default App;
