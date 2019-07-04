import React, {Component} from 'react';
import "../../css/schedule.css";
import moment from "moment";
import PropTypes from "prop-types";

const eventHeight = 20;
const betweenDaysHeight = 10;
const dayLength = 23;
const eventMargin = 5;

class Event extends Component {
    render() {
        const {
            day,
            hour,
            events,
            onEventClick,
        } = this.props;

        const startOfDay = moment(day).startOf('day');
        const endOfDay = moment(day).endOf('day');
        const result = events.map((event) => {
            const startDate = moment(event.start_date);
            const finishDate = moment(event.finish_date);
            let add = false;
            let eventStyle = [];
            let height = eventHeight;
            if (startDate <= endOfDay && finishDate >= startOfDay) {
                let currentClass = "week-and-day-event";
                if (startDate >= startOfDay) {
                    if (startDate.hour() === hour.hour()) {
                        add = true
                    }
                    if (finishDate <= endOfDay) {
                        height = height + (finishDate.hour() - hour.hour()) * (eventHeight + betweenDaysHeight)
                    } else {
                        height = height + (dayLength - hour.hour()) * (eventHeight + betweenDaysHeight) + eventMargin;
                        currentClass += " begin"
                    }
                }

                if (startDate < startOfDay) {
                    if (startOfDay.hour() === hour.hour()) {
                        add = true
                    }
                    if (finishDate <= endOfDay) {
                        height = height + (finishDate.hour() - hour.hour()) * (eventHeight + betweenDaysHeight) + eventMargin;
                        currentClass += " end"
                    } else
                        height = height + (dayLength - hour.hour()) * (eventHeight + betweenDaysHeight) + eventMargin * 2;
                    currentClass += " middle"
                }

                if (add) {
                    eventStyle = {
                        height: height + 'px',
                        backgroundColor: event.calendar.color
                    };
                    return (
                        <div className={currentClass}
                             key={event.id}
                             style={eventStyle}
                             onClick={(e) => onEventClick(e, event)}>
                            {event.title}
                        </div>);
                }
            }
            return {};
        })
        return <div>{result}</div>;
    }
}

Event.propTypes = {
    day: PropTypes.object,
    hour: PropTypes.object,
    events: PropTypes.any,
    onEventClick: PropTypes.func
};


export default Event;