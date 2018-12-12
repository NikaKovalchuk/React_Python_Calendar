import React from "react"

export default class Today extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
          date: this.props.date,
          updateDate: this.props.updateDate,
          today: new Date()
      }
      this.today = this.today.bind(this)
  }

  today ()
    {
        this.state.date.setDate(this.state.today.getDate())
        this.state.date.setMonth(this.state.today.getMonth())
        this.state.date.setFullYear(this.state.today.getFullYear())
        return this.state.updateDate(this.state.date)
    }

  render() {
     return (
         <div>
              <button onClick={this.today}>today</button>
         </div>
     );
  }
}