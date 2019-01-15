import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";
import dateFns from "date-fns";

const viewType = {day:1, week:2, month:3}
const viewNames = {1:"Day", 2:"Week", 3:"Month"}

class Scheduler extends Component {
    constructor(props) {
        super(props);

        this.state = {
            view : viewType.month,
            currentMonth: this.props.currentDate,
            selectedDate: this.props.selectedDate,
            events: {}
        };

        this.changeView = this.changeView.bind(this);
    }

    componentDidMount() {
        this.props.loadUser().then(response => {
            this.setState({
                user: this.props.auth.user
            });
        });
        this.updateEvents(this.state.selectedDate)
    }

    componentWillReceiveProps(props) {
      let update = false
      if (props.selectedDate){
          if (props.selectedDate!=this.state.selectedDate){
              update = true
              this.setState({
                selectedDate: props.selectedDate
              });
          }
      }
      if (update){
        this.updateEvents(props.selectedDate)
      }
    }

    updateEvents(date){
        let startDate = new Date(dateFns.startOfMonth(date)).toISOString()
        let finishDate = new Date(dateFns.endOfMonth(date)).toISOString()
        this.props.loadEvents(startDate, finishDate).then(response => {
            this.setState({
                events: this.props.events
            });
        });
    }

    changeView(newView){
        this.setState({
            view: newView
        })
        console.log(this.state.events)
    }

    renderButtons() {
       return (
            <div className={'shedule-buttons'}>
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => this.changeView(viewType.day)}>Day</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => this.changeView(viewType.week)}>Week</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => this.changeView(viewType.month)}>Month</button>
                </div>
            </div>
        )
    }

    renderDayTable(){
        const {currentMonth, selectedDate} = this.state;
        const dayStart = dateFns.startOfDay(selectedDate)
        const dayEnd = dateFns.endOfDay(selectedDate)

        const timeFormat = "HH:mm";
        const hours = [];
        let line = [];
        let hour = dayStart;

        while (hour <= dayEnd) {
            let formattedTime = dateFns.format(hour, timeFormat);
            line.push(
                <div className={'shedule-hour'}>
                    <span >{formattedTime}</span>
                </div>
            );
            line.push(
                <div className={'shedule-day'}>
                    <span>asd</span>
                </div>
            );

            hours.push(
                <div className="row" key={hour}>
                    {line}
                </div>
            );
            line = [];
            hour = dateFns.addHours(hour,1)
        }

        return <div className="shedule-table">{hours}</div>;
    }

    renderWeekTable(){
        const {currentMonth, selectedDate} = this.state;
        const weekStart = dateFns.startOfWeek(selectedDate);
        const weekEnd = dateFns.endOfWeek(selectedDate);
        const dayStart = dateFns.startOfDay(selectedDate)
        const dayEnd = dateFns.endOfDay(selectedDate)

        const dateFormat = "D";
        const timeFormat = "HH:mm";
        const hours = [];
        let days = [];
        let hour = dayStart;

        let day = weekStart;
        days.push(
            <div className="shedule-week-title-empty"></div>
        );
        for (let i = 0; i < 7; i++) {
                let formattedDate = dateFns.format(day, dateFormat);
                days.push(
                    <div className="shedule-week-day">
                        <span >{formattedDate}</span>
                    </div>
                );
                day = dateFns.addDays(day, 1);
            }
        hours.push(
                <div className="row" key={day}>
                    {days}
                </div>
        );
        days=[]

        while (hour <= dayEnd) {
            let day = weekStart;
            let formattedTime = dateFns.format(hour, timeFormat);
            days.push(
                <div className="shedule-hour">
                    <span >{formattedTime}</span>
                </div>
            );
            for (let i = 0; i < 7; i++) {
                days.push(
                    <div className="shedule-week-day">
                        <span ></span>
                    </div>
                );
                day = dateFns.addDays(day, 1);
            }
            hours.push(
                <div className="row" key={day + ' ' + hour}>
                    {days}
                </div>
            );
            days = [];
            hour = dateFns.addHours(hour,1)
        }

        return <div className="shedule-table">{hours}</div>;
    }

    renderMonthTable(){
        const {selectedDate} = this.state;
        const monthStart = dateFns.startOfMonth(selectedDate);
        const monthEnd = dateFns.endOfMonth(monthStart);
        const startDate = dateFns.startOfWeek(monthStart);
        const endDate = dateFns.endOfWeek(monthEnd);

        const dateFormat = "D";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";
        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = dateFns.format(day, dateFormat);
                const cloneDay = day;
                days.push(
                    <div className={`shedule-month-day ${
                            !dateFns.isSameMonth(day, monthStart)
                                ? "disabled"
                                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
                            }`}
                        key={day} onClick={() => this.onDateClick(dateFns.parse(cloneDay))}>
                        <span className="number">{formattedDate}</span>
                    </div>
                );
                day = dateFns.addDays(day, 1);
            }
            rows.push(
                <div className="row" key={day+"row"}>
                    {days}
                </div>
            );
            days = [];
        }

        return <div className="shedule-table">{rows}</div>;
    }


    renderTable() {
       let table;
       if (this.state.view === viewType.day ){
           table = this.renderDayTable()
       }
       else if (this.state.view === viewType.week ){
           table = this.renderWeekTable()
       }
       else{
            table = this.renderMonthTable()
       }
       return (
            <div className={'shedule'}>
                {table}
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderButtons()}
                {this.renderTable()}
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        auth: state.auth,
        events: state.events,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => {
            return dispatch(auth.loadUser());
        },
        loadEvents: (startDate, finishDate) => {
            return dispatch(events.loadEvents(startDate, finishDate));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);