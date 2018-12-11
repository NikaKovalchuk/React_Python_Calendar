var buttonsType = {
    back:0,
    next:1
}
var viewType = {
    day:0,
    week:1,
    month:2,
    year:3
}

class Account extends React.Component{
     render(){
        return(
            <div id="account-toolbar">
                <button><a href={"./login.html"}>LOG</a></button>
            </div>
        )
    }
}

class MenuView extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            view : viewType.day
        }
    }

    createList(){
        var list = []
        for (var i=0; i < 4; i++){
            list.push(<option key={i}>{viewType[i]} la{i}</option>)
        }
        return list
    }

    render(){
        return(
            <div>
                <select>
                    {this.createList()}
                </select>
            </div>
        )
    }
}

class CurrentDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: this.props.date
        };
        this.convert=this.convert.bind(this)
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

class Today extends React.Component{
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

class ControlButton extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
          type: this.props.type,
          date: this.props.date,
          updateDate: this.props.updateDate
      }
  }


  render() {
     return (
         <div>
           {this.state.type == buttonsType.back? (
              <button>backView</button>
            ) : (
              <button>nextView</button>
            )}
         </div>
     );
  }
}

class Toolbar extends React.Component{
   constructor(props) {
        super(props);
        this.state = {
          calendarDate: new Date(),
          today: new Date()
        };
    }

  updateDate =(value) => {
    this.setState({ calendarDate: value })
  }

  render() {
    return (
        <div>
          <div className="toolbar-element" id="current-date-toolbar" >
              <CurrentDate id="current-date-toolbar" date={this.state.calendarDate}/>
          </div>

          <div className="toolbar-element" id="control-buttons-toolbar">
              <Today id="today" updateDate={this.updateDate} date={this.state.calendarDate}/>
              <div>
                <ControlButton className="control-button" type={buttonsType.back} updateDate={this.updateDate} date={this.state.calendarDate}/>
                <ControlButton className="control-button" type={buttonsType.next} updateDate={this.updateDate} date={this.state.calendarDate}/>
              </div>
          </div>

          <div className="toolbar-element" id="menu-toolbar">
              <MenuView/>
              <Account/>
          </div>
        </div>
    )
  }
}

//***************************

ReactDOM.render(
    <Toolbar/>,
    document.getElementById('toolBar')
);
