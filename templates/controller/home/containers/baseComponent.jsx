import React from "react"
import Radium from "radium"

import { connect } from "react-redux"

import * as counterActions from "../actions/counterActions"
import MenuView from "../components/MenuView"
import Account from "../components/Account"
import Logo from "../components/Logo"

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

class AddEvent extends React.Component{
    render() {
        return (
            <button><a href={`/event/`}>Add event</a></button>
        )
    }
}

@Radium
export default class BaseComponent extends React.Component {
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
      <div id={"toolbar"}>
          <Logo/>
          <div id="menu-toolbar">
              <AddEvent/>
              <MenuView/>
              <Account/>
          </div>
      </div>
    )
  }
}