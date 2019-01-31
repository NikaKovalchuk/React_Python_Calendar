import React from "react";
import dateFns from "date-fns";
import '../css/calendar.css'
import moment from "moment";

class ControlPanel extends React.Component {
    render() {
        const dateFormat = "MMM YYYY";

        return (
            <div className="header row flex-middle">
                <div className="col col-start"
                     onClick={() => this.props.changeViewDate(dateFns.subMonths(this.props.viewDate, 1))}>
                    <div className={"icon"}> Prev</div>
                </div>
                <div className="col col-center">
            <span>
              {dateFns.format(this.props.viewDate, dateFormat)}
            </span>
                </div>
                <div className="col col-end"
                     onClick={() => this.props.changeViewDate(dateFns.addMonths(this.props.viewDate, 1))}>
                    <div className="icon">Next</div>
                </div>
            </div>
        );

    }
}


class NamesOfDays extends React.Component {
    render() {
        const dateFormat = "dd";
        const days = [];
        let startDate = dateFns.startOfWeek(this.props.viewDate);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col col-center" key={i}>
                    {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
                </div>
            );
        }
        return <div className="days row">{days}</div>;
    }
}

class Days extends React.Component {
    render() {
        const monthStart = dateFns.startOfMonth(this.props.viewDate);
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
                            dateFns.isSameDay(day, this.props.selectedDate) ? "selected" : ""}
                            ${dateFns.isSameDay(day, moment().startOf('day')) ? "today" : ""}`}
                        key={day}
                        onClick={() => this.props.onDateClick(cloneDay)}>
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
}

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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

    onDateClick = day => {
        this.setState({selectedDate: day});
        this.props.changeDate(day);
    };

    changeViewDate = date => {
        this.setState({
            viewDate: date
        })
    }

    render() {
        return (
            <div className={'calendar'}>
                <ControlPanel viewDate={this.state.viewDate} changeViewDate={this.changeViewDate}/>
                <NamesOfDays viewDate={this.state.viewDate}/>
                <Days viewDate={this.state.viewDate} selectedDate={this.state.selectedDate} onDateClick={this.onDateClick}/>
            </div>
        );
    }
}

export default Calendar;