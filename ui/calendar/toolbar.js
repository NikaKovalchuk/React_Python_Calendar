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
            list.push(<option>{viewType[i]} la{i}</option>)
        }
        return list
    }

    render(){
        return(
            <select>
                {this.createList()}
            </select>
        )
    }
}

class CurrentDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.date};
    }
  render() {
    return (
        <p>{this.state.date.toDateString()}</p>
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

class Menu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            view: true
        }
        this.changeMenuView = this.changeMenuView.bind(this)
    }

    changeMenuView (){
        this.state.view = !this.state.view
    }

    render() {
        return(
            <button onClick={this.changeMenuView}> Menu {this.state.view}</button>
        )
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
          <Menu/>
          <CurrentDate date={this.state.today}/>
          <CurrentDate date={this.state.calendarDate}/>
          <Today updateDate={this.updateDate} date={this.state.calendarDate}/>
          <div>
            <ControlButton type={buttonsType.back} updateDate={this.updateDate} date={this.state.calendarDate}/>
            <ControlButton type={buttonsType.next} updateDate={this.updateDate} date={this.state.calendarDate}/>
          </div>
          <MenuView/>
        </div>
    )
  }
}

//***************************

ReactDOM.render(
    <Toolbar/>,
    document.getElementById('toolBar')
);
