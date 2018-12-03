var buttonsType = {
    back:0,
    next:1
}

class CurrentDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.today};
    }
  render() {
    return (
        <p>{this.state.date.toDateString()}</p>
    )
  }
}

class ControlButton extends React.Component{
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

class Month extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          date: this.props.today
      };
  }

  getDay(date) { // получить номер дня недели, от 0(пн) до 6(вс)
    var day = date.getDay();
    if (day == 0) day = 7;
    return day - 1;
  }

  createTable(){
    var dateForCalendar = new Date(this.state.date.getFullYear(), this.state.date.getMonth());
    var row = []
    var table = []
    var emptyRows = true

    while (dateForCalendar.getMonth() == this.state.date.getMonth()) {
      if (emptyRows){
        for (var i = 0; i < this.getDay(dateForCalendar); i++) {
          row.push(<td></td>)
        }
        emptyRows = false
      }
      if (!emptyRows){
          if (dateForCalendar.getDate() == this.state.date.getDate())
          {
            row.push(<td style={{color: 'blue'}}>{dateForCalendar.getDate()}</td>)
          }
          else {
              row.push(<td>{dateForCalendar.getDate()}</td>)
          }
          if (this.getDay(dateForCalendar) % 7 == 6) {
            table.push(<tr>{row}</tr>)
            row = []
          }
          dateForCalendar.setDate( dateForCalendar.getDate() + 1);
      }
    }

    if (this.getDay(dateForCalendar) != 0) {
          for (var i = this.getDay(dateForCalendar); i < 7; i++) {
            row.push(<td></td>);
          }
        }
    table.push(<tr>{row}</tr>)
    return table
  }

  render(){
      return(
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
      )
  }
}

class Calendar extends React.Component{
   constructor(props) {
    super(props);
    this.state = {
      date: new Date()};
    }

  updateDate =(value) => {
    this.setState({ date: value })
  }

  render() {
    return (
        <div>
          <CurrentDate today={this.state.date}/>
          <div>
            <ControlButton type={buttonsType.back} updateDate={this.updateDate} today={this.state.date}/>
            <ControlButton type={buttonsType.next} updateDate={this.updateDate} today={this.state.date}/>
          </div>
          <Month today={this.state.date}/>
        </div>
    )
  }
}

//***************************

ReactDOM.render(
    <Calendar/>,
    document.getElementById('menuBar')
);
