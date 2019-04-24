import React from "react";
import '../css/calendar.css'
import moment from "moment";
import PropTypes from "prop-types";

class ControlPanel extends React.Component {
    render() {
        const dateFormat = "MMM YYYY";

        return (
            <div className="header row flex-middle">
                <div className="col col-start"
                     onClick={() => this.props.changeViewDate(moment(this.props.viewDate).add(-1, 'month'))}>
                    <div className={"icon"}> Prev</div>
                </div>
                <div className="col col-center">
            <span>
              {moment(this.props.viewDate).format(dateFormat)}
            </span>
                </div>
                <div className="col col-end"
                     onClick={() => this.props.changeViewDate(moment(this.props.viewDate).add(1, 'month'))}>
                    <div className="icon">Next</div>
                </div>
            </div>
        );

    }
}

ControlPanel.propTypes = {
    viewDate: PropTypes.object,
    changeDate: PropTypes.func
};


class NamesOfDays extends React.Component {
    render() {
        const dateFormat = "dd";
        const days = [];
        let startDate = moment().startOf('week');

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col col-center" key={i}>
                    {moment(startDate).add(i, 'day').format(dateFormat)}
                </div>
            );
        }
        return <div className="days row">{days}</div>;
    }
}

class Days extends React.Component {
    render() {
        const monthStart = moment(this.props.viewDate).startOf('month');
        const startDate = moment(monthStart).startOf('week');
        const endDate = moment(monthStart).endOf('month');
        const dateFormat = "D";
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;

                formattedDate = moment(day).format(dateFormat);
                days.push(
                    <div
                        className={`col cell ${!moment(day).isSame(monthStart, 'month') ? "disabled" :
                            moment(day).isSame(this.props.selectedDate, 'day') ? "selected" : ""}
                            ${moment(day).isSame(moment().startOf('day'), 'day') ? "today" : ""}`}
                        key={day}
                        onClick={() => this.props.onDateClick(cloneDay._d)}>
                        <span className="number">{formattedDate}</span>
                    </div>
                );
                day = moment(day).add(1, 'day');
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

Days.propTypes = {
    selectedDate: PropTypes.object,

    changeDate: PropTypes.func,
    onDateClick: PropTypes.func
};


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
                <NamesOfDays/>
                <Days viewDate={this.state.viewDate} selectedDate={this.state.selectedDate}
                      onDateClick={this.onDateClick}/>
            </div>
        );
    }
}


Calendar.propTypes = {
    selectedDate: PropTypes.object,

    changeDate: PropTypes.func
};

export default Calendar;