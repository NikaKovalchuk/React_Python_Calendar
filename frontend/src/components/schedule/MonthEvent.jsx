import React, {Component} from 'react';
import "../../css/schedule.css"
import moment from "moment";
import PropTypes from "prop-types";
import {endOfDay, startOfDay, startOfWeek, endOfWeek} from "../../lib/date.js";

const cellWidth = 100;
const eventsLimit = 3;
const eventMargin = 5;
const eventHeight = 25;
const eventWidth = cellWidth - 2 * eventMargin;

class MonthEvent extends Component {
    render() {
        const today = this.props.today;
        const weekStart = startOfWeek(today);
        const weekEnd = endOfWeek(today);
        const result = [];
        let eventsForToday = [];
        let events = this.props.events;

        if (events) {
            for (let index = 0; index < events.length; index++) {
                let event = events[index];
                let finishDate = moment(event.finish_date);
                let startDate = moment(event.start_date);
                let numberOfDays = 0;
                let currentClass = "month-event";

                if (finishDate < weekEnd && finishDate > weekStart && startDate > weekStart && startDate < weekEnd) {
                    numberOfDays = finishDate.day() - startDate.day()
                } else if (startDate > weekStart && startDate < weekEnd) {
                    numberOfDays = weekEnd.day() - startDate.day()
                } else if (finishDate < weekEnd && finishDate > weekStart) {
                    numberOfDays = finishDate.day() - weekStart.day()
                } else {
                    numberOfDays = weekEnd.day() - weekStart.day()
                }

                let width = eventWidth + numberOfDays * cellWidth;
                if (startDate < endOfDay(today) && finishDate > startOfDay(today)) {
                    eventsForToday.push(event)
                }

                if (startDate <= endOfDay(today) && startDate >= startOfDay(today)) {
                    if (eventsForToday.length > eventsLimit) {
                        result.pop();

                        let buttonStyle = {};
                        if (result.length < eventsLimit - 1) {
                            let margin = 1;
                            if (result.length === 0) margin = 30;
                            buttonStyle = {marginTop: margin + '%',}
                        }
                        result.push(<div className={"more-events"} style={buttonStyle}
                                         onClick={(e) => {this.props.viewDay(e, today)}}
                                         key={"more"}> View all events </div>)
                    } else {
                        if (finishDate > weekEnd) {
                            currentClass += " begin";
                            width += 5
                        }
                        let eventStyle = {
                            width: width + '%',
                            backgroundColor: event.calendar.color
                        };
                        if (result.length === 0 && eventsForToday.length > 1) {
                            let margin = eventHeight + eventMargin;
                            if (eventsForToday.length > 2) {
                                margin *= 2
                            }
                            eventStyle = {
                                marginTop: margin + 'px',
                                width: width + '%',
                                backgroundColor: event.calendar.color
                            }

                        }
                        result.push(<div className={currentClass} style={eventStyle} key={event.id}
                                         onClick={(e) => this.props.onEventClick(e, event)}>{event.title}</div>)
                    }

                } else if (startDate < weekStart && finishDate > weekStart && startOfDay(today) <= weekStart) {
                    let classToAdd = " end";
                    if (finishDate > weekEnd) {
                        classToAdd = " middle";
                        width = width + eventMargin
                    }
                    currentClass += classToAdd;
                    let eventStyle = {
                        width: width + eventMargin + '%',
                        backgroundColor: event.calendar.color
                    };
                    result.push(<div className={currentClass} style={eventStyle}
                                     key={event.id + "_" + event.title + today}
                                     onClick={(e) => this.props.onEventClick(e, event)}>{event.title}</div>)
                }

            }
        }
        return <div className="month-events">{result}</div>;
    }
}

MonthEvent.propTypes = {
    today: PropTypes.object,
    events: PropTypes.any,

    onEventClick: PropTypes.func
};

export default MonthEvent;