import React from "react";
import dateFns from "date-fns";
import {events} from "../actions";

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentMonth: this.props.currentDate,
            selectedDate: this.props.selectedDate
        };
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
              {dateFns.format(this.state.currentMonth, dateFormat)}
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
        let startDate = dateFns.startOfWeek(this.state.currentMonth);
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
        const {currentMonth, selectedDate} = this.state;
        const monthStart = dateFns.startOfMonth(currentMonth);
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
                        className={`col cell ${
                            !dateFns.isSameMonth(day, monthStart)
                                ? "disabled"
                                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
                            }`}
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
            currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
        });
    }
    prevMonth = () => {
        this.setState({
            currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
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