import React from "react"
import Radium from "radium"

import { connect } from "react-redux"

@connect(state => ({
  counters: state.counters,
}))

class AddEvent extends React.Component{
    render() {
        return (
            <button><a href={`/event/`}>Add event</a></button>
        )
    }
}

@Radium
export default class EventListComponent extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        today: new Date()
      };
  }

  updateDate =(value) => {
    this.setState({ calendarDate: value })
  }

  render() {
    return (
      <div>
          <p>dsfsdfsdfdsf</p>
      </div>
    )
  }
}