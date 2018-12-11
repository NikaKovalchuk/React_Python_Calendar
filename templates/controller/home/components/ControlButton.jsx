import React from "react"

const buttonsType = {
    back:0,
    next:1
}

export default class CurrentDate extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          type: this.props.type,
          date: this.props.today,
          updateDate: this.props.updateDate
      }
      this.decreaseMounth = this.decreaseMounth.bind(this)
      this.increaseMounth = this.increaseMounth.bind(this)
  }

  decreaseMounth (){return this.state.updateDate(this.state.date.setMonth(this.state.date.getMonth()-1))}

  increaseMounth (){return this.state.updateDate(this.state.date.setMonth(this.state.date.getMonth()+1))}

  render() {
     return (
         <div>
           {this.state.type == buttonsType.back? (
              <button onClick={this.decreaseMounth}>back</button>
            ) : (
              <button onClick={this.increaseMounth}>next</button>
            )}
         </div>
     );
  }
}