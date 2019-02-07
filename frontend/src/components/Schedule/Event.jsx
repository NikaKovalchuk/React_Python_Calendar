import React, {Component} from 'react';
import "../../css/schedule.css"
import moment from "moment";
import PropTypes from "prop-types";

class Event extends Component {
    render() {
        const day = this.props.day;
        const hour = this.props.hour;
        let result = [];
        let startOfDay = moment(day).startOf('day');
        let endOfDay = moment(day).endOf('day');

        const eventHeight = 20;
        const betweenDaysHeight = 10;
        const dayLength = 23;
        const eventMargin = 5;

        const className = "week-and-day-event";
        const classBegin = " begin";
        const classMiddle = " middle";
        const classEnd = " end";
        const events = this.props.events

        for (let index = 0; index < events.length; index++) {
            let event = events[index];
            let startDate = moment(event.start_date);
            let finishDate = moment(event.finish_date);
            let add = false;
            let eventStyle = [];
            let height = eventHeight;
            if (startDate <= endOfDay && finishDate >= startOfDay) {
                let currentClass = className;
                if (startDate >= startOfDay) {
                    if (startDate.hour() === hour.hour()) {
                        add = true
                    }
                    if (finishDate <= endOfDay) {
                        height = height + (finishDate.hour() - hour.hour()) * (eventHeight + betweenDaysHeight)
                    } else {
                        height = height + (dayLength - hour.hour()) * (eventHeight + betweenDaysHeight) + eventMargin;
                        currentClass += classBegin
                    }
                }

                if (startDate < startOfDay) {
                    if (startOfDay.hour() === hour.hour()) {
                        add = true
                    }
                    if (finishDate <= endOfDay) {
                        height = height + (finishDate.hour() - hour.hour()) * (eventHeight + betweenDaysHeight) + eventMargin;
                        currentClass += classEnd
                    } else
                        height = height + (dayLength - hour.hour()) * (eventHeight + betweenDaysHeight) + eventMargin * 2;
                    currentClass += classMiddle
                }

                if (add === true) {
                    eventStyle = {
                        height: height + 'px',
                        backgroundColor: event.calendar.color
                    };
                    result.push(<div className={currentClass} key={event.id} style={eventStyle}
                                     onClick={(e) => this.props.onEventClick(e, event)}>{event.title}</div>);
                }

            }
        }
        return <div>{result}</div>;
    }
}

Event.propTypes = {
    day: PropTypes.object,
    hour: PropTypes.object,
    events: PropTypes.arrayOf(PropTypes.object),

    onEventClick: PropTypes.func
};


export default Event;