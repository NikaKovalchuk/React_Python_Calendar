import React, {Component} from 'react';
import "../../css/schedule.css";
import moment from "moment";
import PropTypes from "prop-types";
import Event from "./Event";
import {startOfWeek} from "../../lib/date.js";
import {
    getDayIndexesForWeek,
    getHourIndexes
} from "../../lib/schedule";

class Week extends Component {
    render() {
        const selectedDate = this.props.selectedDate;
        const weekStart = startOfWeek(selectedDate);
        const emptyRow = <div className="empty-week-title" key={'empty'}></div>;
        const dayIndexes = getDayIndexesForWeek();
        const daysHeader = dayIndexes.map((day) => {
            const date = moment(weekStart).add(day, 'day');
            return (<div className="week-view-day-title" key={date + '-week-view-day-title'}>
                <span>{moment(date).format("D")}</span>
            </div>)
        });
        const header = <div className="row" key={"header"}> {emptyRow} {daysHeader} </div>;
        const hours = getHourIndexes();
        const week = hours.map((hour) => {
            const sideMenu =
                <div className="day-view-time" key={hour + "-day-view-time"}>
                   <span>{moment(hour).format("hh:mm A")}</span>
                </div>;
            const row = dayIndexes.map((day) => {
                const date = moment(weekStart).add(day, 'day');
                return (
                    <div
                        className="week-view-day"
                        key={day + '-week-view-day'}
                        onClick={() => this.onDateClick(date, hour)}
                    >
                        <Event
                            events={this.props.events}
                            day={date}
                            hour={hour}
                            onEventClick={this.props.onEventClick}
                        />
                    </div>
                )
            });
            return <div className="row" key={hour}> {sideMenu}{row} </div>;
        });
        return <div className="table">{header}{week}</div>;
    }
}

Week.propTypes = {
    selectedDate: PropTypes.object,
    events: PropTypes.any,

    onDateClick: PropTypes.func,
    onEventClick: PropTypes.func
};

export default Week;