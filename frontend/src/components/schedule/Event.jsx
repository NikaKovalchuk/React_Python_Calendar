import React, {Component} from 'react';
import "../../css/schedule.css";
import moment from "moment";
import PropTypes from "prop-types";
import {startOfDay, endOfDay} from "../../lib/date.js";
import {connect} from "react-redux";

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

        const result = events.map((event) => {
            const startDate = moment(event.start_date);
            const finishDate = moment(event.finish_date);
            let add = false;
            let eventStyle = [];
            let height = eventHeight;
            if (startDate <= endOfDay(day) && finishDate >= startOfDay(day)) {
                let currentClass = "week-and-day-event";
                if (startDate >= startOfDay(day)) {
                    if (startDate.hour() === hour) {
                        add = true
                    }
                    if (finishDate <= endOfDay(day)) {
                        height = height + (finishDate.hour() - hour) * (eventHeight + betweenDaysHeight)
                    } else {
                        height = height + (dayLength - hour) * (eventHeight + betweenDaysHeight) + eventMargin;
                        currentClass += " begin"
                    }
                }

                if (startDate < startOfDay(day)) {
                    if (startOfDay(day).hour() === hour) {
                        add = true
                    }
                    if (finishDate <= endOfDay(day)) {
                        height = height + (finishDate.hour() - hour) * (eventHeight + betweenDaysHeight) + eventMargin;
                        currentClass += " end"
                    } else
                        height = height + (dayLength - hour) * (eventHeight + betweenDaysHeight) + eventMargin * 2;
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
            return null;
        });
        return <div>{result}</div>;
    }
}

const mapStateToProps = state => {
    return {
        events: state.events.events,
    }
};


Event.propTypes = {
    day: PropTypes.object,
    hour: PropTypes.number,
    events: PropTypes.any,
    onEventClick: PropTypes.func
};


export default connect(mapStateToProps, null)(Event);