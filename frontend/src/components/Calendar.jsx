import React from "react";
import dateFns from "date-fns";
import '../css/calendar.css'

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDate: this.props.currentDate,
            selectedDate: this.props.selectedDate,
            viewDate: this.props.selectedDate,
        };
    }

    componentWillReceiveProps(props) {
        if (props.selectedDate) {
            if (props.selectedDate !== this.state.selectedDate) {
                this.setState({
                    selectedDate: props.selectedDate,
                    viewDate: props.selectedDate
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
              {dateFns.format(this.state.viewDate, dateFormat)}
            </span>
                </div>
                <div className="col col-end" onClick={this.nextMonth}>
                    <div className="icon">Next</div>
                </div>
            </div>
        );
    }

    renderDays() {
        const dateFormat = "dd";
        const days = [];
        let startDate = dateFns.startOfWeek(this.state.viewDate);

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
        const {currentDate, viewDate} = this.state;
        const monthStart = dateFns.startOfMonth(viewDate);
        const startDate = dateFns.startOfWeek(monthStart);
        const endDate = dateFns.endOfWeek(dateFns.endOfMonth(monthStart));
        const dateFormat = "D";
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;

                formattedDate = dateFns.format(day, dateFormat);
                days.push(
                    <div
                        className={`col cell ${!dateFns.isSameMonth(day, monthStart) ? "disabled" :
                            dateFns.isSameDay(day, currentDate) ? "today" :
                                dateFns.isSameDay(day, this.state.selectedDate) ? "selected" : ""}`}
                        key={day}
                        onClick={() => this.onDateClick(dateFns.parse(cloneDay))}>
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
        this.setState({selectedDate: day});
        this.props.changeDate(day);
    }

    nextMonth = () => {
        this.setState({viewDate: dateFns.addMonths(this.state.viewDate, 1)});
    }

    prevMonth = () => {
        this.setState({viewDate: dateFns.subMonths(this.state.viewDate, 1)});
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

export default Calendar;