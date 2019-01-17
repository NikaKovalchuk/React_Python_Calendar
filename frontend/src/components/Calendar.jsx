import React from "react";
import dateFns from "date-fns";
import {events} from "../actions";
import '../css/calendar.css'

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDate: this.props.currentDate,
            selectedDate: this.props.selectedDate,
        };
    }

    componentWillReceiveProps(props) {
        let update = false
        console.log(props)
        if (props.selectedDate) {
            if (props.selectedDate !== this.state.selectedDate) {
                update = true
                this.setState({
                    selectedDate: props.selectedDate
                });
            }
        }
    }

    renderHeader() {
        const dateFormat = "MMM YYYY";
        return (
            <div className="header row flex-middle">
                <div className="col col-start">
                    <div className="icon" onClick={this.prevMonth}>Prev</div>
                </div>
                <div className="col col-center">
            <span>
              {dateFns.format(this.state.selectedDate, dateFormat)}
            </span>
                </div>
                <div className="col col-end" onClick={this.nextMonth}>
                    <div className="icon">Next</div>
                </div>
            </div>
        );
    }

    renderDays() {
        const dateFormat = "ddd";
        const days = [];
        let startDate = dateFns.startOfWeek(this.state.selectedDate);
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col col-center" key={i}>
                    {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
                </div>
            );
        }
        return <div className="days row">{days}</div>;
    }

    renderCells() {
        const {currentDate, selectedDate} = this.state;
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
                    <div
                        className={`col cell ${!dateFns.isSameMonth(day, monthStart) ? "disabled" :
                                                dateFns.isSameDay(day, currentDate) ? "today" :
                                                dateFns.isSameDay(day, selectedDate)? "selected" : ""}`}
                        key={day}
                        onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
                    >
                        <span className="number">{formattedDate}</span>
                    </div>
                );
                day = dateFns.addDays(day, 1);
            }
            rows.push(
                <div className="row" key={day}>
                    {days}
                </div>
            );
            days = [];
        }

        return <div className="body">{rows}</div>;
    }

    onDateClick = day => {
        this.setState({
            selectedDate: day
        });
        this.props.changeDate(day);
    }

    nextMonth = () => {
        this.setState({
            selectedDate: dateFns.addMonths(this.state.selectedDate, 1)
        });
    }
    prevMonth = () => {
        this.setState({
            selectedDate: dateFns.subMonths(this.state.selectedDate, 1)
        });
    }

    render() {
        return (
            <div className={'calendar'}>
                {this.renderHeader()}
                {this.renderDays()}
                {this.renderCells()}
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        events: state.events,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        import: () => {
            return dispatch(events.loadEvents());
        },
    }
}

export default Calendar;