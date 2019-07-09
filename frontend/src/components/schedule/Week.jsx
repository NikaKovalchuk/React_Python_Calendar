import React, {Component} from 'react';
import "../../css/schedule.css";
import moment from "moment";
import PropTypes from "prop-types";
import Event from "./Event";
import {endOfDay, startOfDay, startOfWeek} from "../../../lib/date";

class Week extends Component {
    render() {
        const selectedDate = this.props.selectedDate;
        const hours = [];

        let week = [];
        let hour = startOfDay(selectedDate);
        let day = startOfWeek(selectedDate);

        week.push(<div className="empty-week-title" key={'empty'}></div>);
        for (let i = 0; i < 7; i++) {
            week.push(
                <div className="week-view-day-title" key={day + '-week-view-day-title'}>
                    <span>{moment(day).format("D")}</span>
                </div>
            );
            day = moment(day).add(1, 'day')
        }
        hours.push(<div className="row" key={day}> {week} </div>);
        week = [];

        while (hour <= endOfDay(selectedDate)) {
            let day = startOfWeek(selectedDate);;
            week.push(
                <div className="day-view-time" key={hour + "-day-view-time"}>
                    <span>{moment(hour).format("hh:mm A")}</span>
                </div>
            );

            for (let i = 0; i < 7; i++) {
                const cloneHour = hour;
                const cloneDay = day;
                week.push(
                    <div className="week-view-day" key={day + '-week-view-day'}
                         onClick={() => this.onDateClick(cloneDay, cloneHour)}>
                        <Event events={this.props.events}
                                day={cloneDay}
                                hour={cloneHour}
                                onEventClick={this.props.onEventClick}
                        />
                    </div>
                );
                day = moment(day).add(1, 'day');
            }
            hours.push(<div className="row" key={day + ' ' + hour}> {week} </div>);
            week = [];
            hour = moment(hour).add(1, 'hour');
        }
        return <div className="table">{hours}</div>;
    }
}

Week.propTypes = {
    selectedDate: PropTypes.object,
    events: PropTypes.any,

    onDateClick: PropTypes.func,
    onEventClick: PropTypes.func
};

export default Week;