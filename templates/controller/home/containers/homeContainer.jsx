import React from "react"
import Radium from "radium"

import { connect } from "react-redux"

import * as counterActions from "../actions/counterActions"
import CurrentDate from "../components/CurrentDate"
import Month from "../components/Month"
import ControlButton from "../components/ControlButton"
import Today from "../components/Today";

const styles = {
  button: {
    cursor: "pointer",
  },
  counter: {
    color: "blue",
    fontSize: "20px",
  }
}

const buttonsType = {
    back:0,
    next:1
}

@connect(state => ({
  counters: state.counters,
}))
@Radium
export default class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()};
  }

  handleClick() {
    let {dispatch} = this.props;
    dispatch(counterActions.increaseCounter())
  }

  updateDate =(value) => {
    this.setState({ date: value })
  }

  render() {
    let {counters} = this.props
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <CurrentDate id="current-date-calendar" today={this.state.date}/>
              <div id="control-buttons-calendar">
                <ControlButton  type={buttonsType.back} updateDate={this.updateDate} today={this.state.date}/>
                <ControlButton  type={buttonsType.next} updateDate={this.updateDate} today={this.state.date}/>
                <Today id="today" updateDate={this.updateDate} date={this.state.date}/>
              </div>
            <Month id="current-month-calendar" today={this.state.date}/>
            <div style={[styles.button]} onClick={() => this.handleClick()}>INCREASE</div>
            <p style={[styles.counter]}>{counters.clicks}</p>
            <p>{process.env.BASE_API_URL}</p>
          </div>
        </div>
      </div>
    )
  }
}