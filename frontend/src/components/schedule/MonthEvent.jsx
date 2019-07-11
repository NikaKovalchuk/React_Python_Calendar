import React, {Component} from 'react';
import "../../css/schedule.css"
import moment from "moment";
import PropTypes from "prop-types";
import {endOfDay, startOfDay, startOfWeek, endOfWeek} from "../../lib/date.js";
import {connect} from "react-redux";

const cellWidth = 100;
const eventsLimit = 3;
const eventMargin = 5;
const eventHeight = 25;
const eventWidth = cellWidth - 2 * eventMargin;

class MonthEvent extends Component {

    getNumberOfDays = (start, finish, weekStart, weekEnd) => {
        if (finish < weekEnd &&
            finish > weekStart &&
            start > weekStart &&
            start < weekEnd)
            return finish.day() - start.day()
        else if (
            start > weekStart &&
            start < weekEnd) return weekEnd.day() - start.day()
        else if (
            finish < weekEnd &&
            finish > weekStart) return finish.day() - weekStart.day()
        else return weekEnd.day() - weekStart.day()
    };

    getStylesForMoreEventsButton = (results, limit) => {
        if (results < limit - 1) {
            let margin = 1;
            if (results === 0) margin = 30;
            return {marginTop: margin + '%',}
        }
        return {}
    };

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
                let currentClass = "month-event";

                const numberOfDays = this.getNumberOfDays(startDate, finishDate, weekStart, weekEnd)
                let width = eventWidth + numberOfDays * cellWidth;
                if (startDate < endOfDay(today) && finishDate > startOfDay(today)) {
                    eventsForToday.push(event)
                }

                if (startDate <= endOfDay(today) && startDate >= startOfDay(today)) {
                    if (eventsForToday.length > eventsLimit) {
                        result.pop();
                        const buttonStyle = this.getStylesForMoreEventsButton(result.length, eventsLimit)
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

const mapStateToProps = state => {
    return {
        events: state.events.events
    }
};

MonthEvent.propTypes = {
    today: PropTypes.object,
    events: PropTypes.array,
    onEventClick: PropTypes.func
};

export default connect(mapStateToProps, null)(MonthEvent);