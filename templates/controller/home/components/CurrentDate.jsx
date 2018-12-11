import React from "react"

export default class CurrentDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.today
    };
    this.convert = this.convert.bind(this)
  }

 convert(){
        var year = this.state.date.getFullYear()
        var locale = "en-us";
        var month = this.state.date.toLocaleString(locale, {
            month: "long"
        });
        return month+" "+ year
    }

  render() {
    return (
        <p>{this.convert()}</p>
    )
  }
}