import React from "react"
import * as counterActions from "../actions/counterActions";

export default class CurrentDate extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          date: this.props.today,
          updateDate: this.props.updateDate
      };
  }

  getDay(date) { // получить номер дня недели, от 0(пн) до 6(вс)
    var day = date.getDay();
    if (day == 0) day = 7;
    return day - 1;
  }

  handleClick(date) {
    this.state.updateDate(date)
    console.log(date)
  }

  createTable(){
    var dateForCalendar = new Date(this.state.date.getFullYear(), this.state.date.getMonth());
    var row = []
    var td = 0
    var tr = 0
    var table = []
    var emptyRows = true

    while (dateForCalendar.getMonth() == this.state.date.getMonth()) {
      if (emptyRows){
        for (var i = 0; i < this.getDay(dateForCalendar); i++) {
          row.push(<td key={td}></td>)
          td += 1
        }
        emptyRows = false
      }
      if (!emptyRows){
          if (dateForCalendar.getDate() == this.state.date.getDate())
          {
            row.push(<td id="today-td" key={td} onClick={() => this.handleClick(dateForCalendar)} >{dateForCalendar.getDate()}</td>)
            td += 1
          }
          else {
              row.push(<td key={td} onClick={() => this.handleClick(dateForCalendar)} >{dateForCalendar.getDate()}</td>)
              td += 1
          }
          if (this.getDay(dateForCalendar) % 7 == 6) {
            table.push(<tr key={tr} onClick={() => this.handleClick(dateForCalendar)}>{row}</tr>)
            tr += 1
            row = []
          }
          dateForCalendar.setDate( dateForCalendar.getDate() + 1);
      }
    }

    if (this.getDay(dateForCalendar) != 0) {
          for (var i = this.getDay(dateForCalendar); i < 7; i++) {
            row.push(<td key={td}></td>);
            td += 1
          }
        }
    table.push(<tr key={tr}>{row}</tr>)
    return table
  }

  render(){
      return(
          <div className="table">
             <table>
               <thead>
               <tr>
                  <td>пн</td><td>вт</td><td>ср</td><td>чт</td><td>пт</td><td>сб</td><td>вс</td>
               </tr>
               </thead>
               <tbody>
                  {this.createTable()}
               </tbody>
            </table>
          </div>
      )
  }
}