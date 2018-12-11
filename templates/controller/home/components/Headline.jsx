import React from "react"

export default class CurrentDate extends React.Component {
  render() {
    return (
      <h1>{ this.props.children }</h1>
    )
  }
}