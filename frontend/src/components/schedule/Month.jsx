import React, {Component} from 'react';
import "../../css/schedule.css";
import moment from "moment";
import PropTypes from "prop-types";
import MonthEvent from "./MonthEvent";
import {endOfMonth, endOfWeek, startOfMonth, startOfWeek} from "../../lib/date.js";
import {getDayIndexesForWeek} from "../../lib/schedule";

class Month extends Component {
    render() {
        const selectedDate = this.props.selectedDate;
        const monthStart = startOfMonth(selectedDate);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(endOfMonth(monthStart));

        let month = [];
        let week = [];
        let day = startDate;

        const dayIndexes = getDayIndexesForWeek();
        while (day <= endDate) {
            week = dayIndexes.map((day) => {
                const date = moment(selectedDate).add(day, 'day');
                return (
                    <div className={`month-view-day`}
                         onClick={() => this.props.onDateClick(date, null)}
                         key={day}>
                        <div className="number"
                             onClick={(e) => this.props.viewDay(e, date)}>{moment(day).format("D")}</div>
                        <MonthEvent today={date}
                                    events={this.props.events}
                                    onEventClick={this.props.onEventClick}
                                    viewDay={this.props.viewDay}
                        />
                    </div>
                )
            });
            month.push(<div className="row" key={day + "row"}> {week} </div>);
            week = [];
        }
        return <div className="table">{month}</div>;
    }
}

Month.propTypes = {
    selectedDate: PropTypes.object,
    events: PropTypes.any,
    onDateClick: PropTypes.func,
    onEventClick: PropTypes.func,
    viewDay: PropTypes.func
};
export default Month;