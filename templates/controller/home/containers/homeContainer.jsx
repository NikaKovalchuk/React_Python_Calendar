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
      date: new Date()
    };
  }

  updateDate =(value) => {
    this.setState({ date: value })
  }


  render() {
    let {counters} = this.props
    return (
        <div className="row" id="content">
          <div className="col-sm-4 col-lg-2" id="calendar">
              <CurrentDate id="current-date-calendar" today={this.state.date}/>
                <div id="control-buttons-calendar">
                  <ControlButton  type={buttonsType.back} updateDate={this.updateDate} today={this.state.date}/>
                  <ControlButton  type={buttonsType.next} updateDate={this.updateDate} today={this.state.date}/>
                  <Today id="today" updateDate={this.updateDate} date={this.state.date}/>
                </div>
              <Month id="current-month-calendar" today={this.state.date} updateDate={this.updateDate}/>
          </div>
          <div className="col-sm-8 col-lg-10" id="work-space">
            sadasdasd
          </div>
        </div>
    )
  }
}