import React, {Component} from 'react';
import {connect} from 'react-redux';
import {events} from "../actions";
import "../css/schedule.css"
import EventModal from "./modals/Event";
import Info from "./modals/Info";
import moment from "moment";

const viewType = {day: 0, week: 1, month: 2};

class ControlPanel extends Component {
    render() {
        return (
            <div>
                <div className={'today-button'}>
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => this.props.changeDate(moment().startOf('day'))}>
                            Today
                        </button>
                    </div>
                </div>

                <div className={'view-buttons'}>
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => this.props.changeView(viewType.day)}>Day
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => this.props.changeView(viewType.week)}>Week
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => this.props.changeView(viewType.month)}>Month
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

class MonthEvent extends Component {
    render() {
        const defaultClass = "month-event";
        const classBegin = " begin";
        const classMiddle = " middle";
        const classEnd = " end";

        const cellWidth = 100;
        const eventsLimit = 3;
        const eventMargin = 5;
        const eventHeight = 25;
        const eventWidth = cellWidth - 2 * eventMargin;

        const today = this.props.today;
        const beginOfToday = moment(today).startOf('day');
        const endOfToday = moment(today).endOf('day');
        const beginOfWeek = moment(today).startOf('week');
        const endOfWeek = moment(today).endOf('week');
        const result = [];

        let eventsForToday = [];
        let events = this.props.events
        for (let index = 0; index < events.length; index++) {
            let event = events[index];
            let finishDate = moment(event.finish_date);
            let startDate = moment(event.start_date);
            let numberOfDays = 0;
            let currentClass = defaultClass;

            if (finishDate < endOfWeek && finishDate > beginOfWeek && startDate > beginOfWeek && startDate < endOfWeek) {
                numberOfDays = finishDate.date() - startDate.date()
            } else if (startDate > beginOfWeek && startDate < endOfWeek) {
                numberOfDays = endOfWeek.date() - startDate.date()
            } else if (finishDate < endOfWeek && finishDate > beginOfWeek) {
                numberOfDays = finishDate.date() - beginOfWeek.date()
            } else {
                numberOfDays = endOfWeek.date() - beginOfWeek.date()
            }

            let width = eventWidth + numberOfDays * cellWidth;
            if (startDate < endOfToday && finishDate > beginOfToday) {
                eventsForToday.push(event)
            }

            if (startDate <= endOfToday && startDate >= beginOfToday) {
                if (eventsForToday.length > eventsLimit) {
                    result.pop();

                    let buttonStyle = {};
                    if (result.length < eventsLimit - 1) {
                        let margin = 1;
                        if (result.length === 0) margin = 30;
                        buttonStyle = {marginTop: margin + '%',}
                    }
                    result.push(<div className={"more-events"} style={buttonStyle}
                                     onClick={(e) => this.props.viewDay(e, today)}
                                     key={"more"}> View all events </div>)
                } else {
                    if (finishDate > endOfWeek) {
                        currentClass += classBegin;
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

            } else if (startDate < beginOfWeek && finishDate > beginOfWeek && beginOfToday <= beginOfWeek) {
                let classToAdd = classEnd;
                if (finishDate > endOfWeek) {
                    classToAdd = classMiddle;
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
        return <div className="month-events">{result}</div>;
    }
}

class Events extends Component {
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
                        height = height + (finishDate.hour() - hour) * (eventHeight + betweenDaysHeight)
                    } else {
                        height = height + (dayLength - hour) * (eventHeight + betweenDaysHeight) + eventMargin;
                        currentClass += classBegin
                    }
                }

                if (startDate < startOfDay) {
                    if (startOfDay.hour() === hour.hour()) {
                        add = true
                    }
                    if (finishDate <= endOfDay) {
                        height = height + (finishDate.hour() - hour) * (eventHeight + betweenDaysHeight) + eventMargin;
                        currentClass += classEnd
                    } else
                        height = height + (dayLength - hour) * (eventHeight + betweenDaysHeight) + eventMargin * 2;
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

class Month extends Component {
    render() {
        const selectedDate = this.props.selectedDate;
        const monthStart = moment(selectedDate).startOf('month');
        const monthEnd = moment(monthStart).endOf('month');
        const startDate = moment(monthStart).startOf('week')
        const endDate = moment(monthEnd).endOf('week');

        let month = [];
        let week = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                week.push(
                    <div className={`month-view-day`}
                         onClick={() => this.props.onDateClick(cloneDay, null)}
                         key={day}>
                        <div className="number"
                             onClick={(e) => this.props.viewDay(e, cloneDay)}>{moment(day).format("D")}</div>
                        <MonthEvent today={cloneDay}
                                    events={this.props.events}
                                    onEventClick={this.props.onEventClick}
                                    viewDay={this.props.viewDay}
                        />
                    </div>
                );
                day = moment(day).add(1, 'day');
            }
            month.push(<div className="row" key={day + "row"}> {week} </div>);
            week = [];
        }
        return <div className="table">{month}</div>;
    }
}

class Week extends Component {
    render() {
        const selectedDate = this.props.selectedDate;
        const weekStart = moment(selectedDate).startOf('week')
        const dayStart = moment(selectedDate).startOf('day')
        const dayEnd = moment(selectedDate).endOf('day')
        const hours = [];

        let week = [];
        let hour = dayStart;
        let day = weekStart;

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

        while (hour <= dayEnd) {
            let day = weekStart;
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
                        <Events events={this.props.events}
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

class Day extends Component {
    render() {
        const selectedDate = this.props.selectedDate;
        const dayStart = moment(selectedDate).startOf('day')
        const dayEnd = moment(selectedDate).endOf('day');
        const day = selectedDate;
        const hours = [];

        let hour = dayStart;
        hours.push(<div className="day-title" key={day}><span>{moment(day).format("D")}</span></div>);

        while (hour <= dayEnd) {
            const cloneHour = hour;
            hours.push(
                <div className="row" key={'row' + hour}>
                    <div className={'day-view-time'} key={'day-view-time'}>
                        <span>{moment(hour).format("hh:mm A")}</span>
                    </div>
                    <div className={'day-view-data'} key={'day-view-data'}
                         onClick={() => this.props.onDateClick(day, cloneHour)}>
                        <Events events={this.props.events}
                                day={day}
                                hour={cloneHour}
                                onEventClick={this.props.onEventClick}
                        />
                    </div>
                </div>
            );
            hour = moment(hour).add( 1, 'hour')
        }

        return <div className="table">{hours}</div>;
    }
}

class ScheduleTable extends Component {
    render() {
        let table;
        if (this.props.view === viewType.day) {
            table = <Day selectedDate={this.props.selectedDate}
                         onEventClick={this.props.onEventClick}
                         viewDay={this.props.viewDay}
                         view={this.props.view}
                         events={this.props.events}
                         onDateClick={this.props.onDateClick}
            />
        }
        if (this.props.view === viewType.week) {
            table = <Week selectedDate={this.props.selectedDate}
                          onEventClick={this.props.onEventClick}
                          viewDay={this.props.viewDay}
                          view={this.props.view}
                          events={this.props.events}
                          onDateClick={this.props.onDateClick}
            />
        }
        if (this.props.view === viewType.month) {
            table = <Month selectedDate={this.props.selectedDate}
                           onEventClick={this.props.onEventClick}
                           viewDay={this.props.viewDay}
                           view={this.props.view}
                           events={this.props.events}
                           onDateClick={this.props.onDateClick}
            />
        }

        return (
            <div className={'shedule'}>{table}</div>
        )
    }
}


class Schedule extends Component {

    constructor(props) {
        super(props);

        this.state = {
            view: viewType.month,
            currentDate: this.props.currentDate,
            selectedDate: this.props.selectedDate,
            clickedDate: null,
            id: null,
            calendars: this.props.calendars,
            calendarsId: [],
            newEvent: {
                id: null,
                title: "",
                text: "",
                startDate: moment().toISOString(),
                finishDate: moment().hour(moment().hour() + 1).toISOString(),
                repeat: 0,
                notice: false,
                notification: 0,
                calendar: this.props.calendars[0],
            },

            event: {},
            notificationEvent: {},
            notifications: {},
            events: {},
            isOpen: false,
            isOpenNotification: false,
        };
    }

    componentDidMount() {
        this.updateEvents(this.state.selectedDate)
    }

    componentWillReceiveProps(props) {
        let update = false;
        let calendars = []
        if (props.selectedDate) {
            if (props.selectedDate !== this.state.selectedDate) {
                if (moment(props.selectedDate).month() !== moment(this.state.selectedDate).month()) {
                    update = true
                }
                this.setState({selectedDate: props.selectedDate});
            }
        }
        if (props.calendars) {
            if (props.calendars !== this.state.calendars) {
                update = true
                this.setState({
                    calendars: this.props.calendars
                })
                for (let index = 0; index < props.calendars.length; index++) {
                    let calendar = props.calendars[index]
                    if (calendar.show === true) {
                        calendars.push(calendar.id)
                    }
                }
                this.setState({
                    calendarsId: calendars
                })
            }
        }

        if (update) {
            this.updateEvents(props.selectedDate)
        }
    }

    updateEvents(date) {
        const startDate = moment(date).startOf('month').startOf('week').toISOString();
        const finishDate =  moment(date).endOf('month').endOf('week');

        this.props.loadEvents(startDate, finishDate, this.state.calendarsId).then(response => {
            this.setState({events: this.props.events});
        });
        this.props.loadNotifications(startDate, finishDate, this.state.calendarsId).then(response => {
            this.setState({notifications: this.props.events});
            if (this.props.events !== []) {
                let event = this.props.events[this.props.events.length - 1];
                if (event) {
                    this.setState({
                        isOpenNotification: true,
                        notificationEvent: event,
                    });
                }
            }
        });
    }

    viewDay = (e, day) => {
        this.setState({
            selectedDate: day,
            view: viewType.day
        });
        e.stopPropagation();
    };

    dismissNotification = () => {
        let event = this.state.notificationEvent;
        let events = this.state.notifications;
        events.pop();
        event.notice = false;
        this.props.updateEvent(event.id, event);

        if (events !== []) {
            let event = events[events.length - 1];
            this.setState({
                isOpenNotification: event ? true : false,
                notificationEvent: event ? event : {},
                notifications: events,
            });
        }
    };

    toggleModal = () => {
        if (this.state.isOpen === true) {
            this.setState({event: this.state.newEvent,});
            this.updateEvents(this.state.selectedDate)
        }
        this.setState({isOpen: !this.state.isOpen});
    };

    complete = (event) => {
        if (event.id) {
            this.props.updateEvent(event.id, event).then(response => {
                this.toggleModal()
            });
        } else {
            this.props.addEvent(event).then(response => {
                this.toggleModal()
            });
        }
    };

    onDateClick = (day, hour) => {
        if (hour != null) {
            day = moment(day.setHours(hour.getHours()))
        }
        this.setState({
            event: {},
            clickedDate: day,
        });
        this.toggleModal()
    };

    onEventClick = (e, event) => {
        this.setState({
            event: event,
            clickedDate: null,
        });
        this.toggleModal();
        e.stopPropagation();
    };

    changeView = (view) => {
        this.setState({
            view: view
        })
    }

    render() {
        return (
            <div className={'tall'}>

                <ControlPanel changeView={this.changeView} changeDate={this.props.changeDate}/>

                <ScheduleTable view={this.state.view}
                               selectedDate={this.props.selectedDate}
                               events={this.props.events}
                               viewDay={this.viewDay}
                               onDateClick={this.onDateClick}
                               onEventClick={this.onEventClick}
                />

                <EventModal show={this.state.isOpen} onCancel={this.toggleModal} onOk={this.complete}
                            event={this.state.event} date={this.state.clickedDate}
                            calendars={this.state.calendars}></EventModal>

                <Info show={this.state.isOpenNotification} onOk={this.dismissNotification}
                      header={"Notification about event \"" + this.state.notificationEvent.title + "\""}>
                    Event "{this.state.notificationEvent.title}" starts
                    in {moment(this.state.notificationEvent.start_date).toLocaleString()}
                </Info>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        events: state.events,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        loadEvents: (startDate, finishDate, calendars) => {
            return dispatch(events.loadEvents(startDate, finishDate, calendars));
        },
        loadNotifications: (startDate, finishDate, calendars) => {
            return dispatch(events.loadNotifications(startDate, finishDate, calendars));
        },
        addEvent: (model) => {
            return dispatch(events.addEvent(model));
        },
        updateEvent: (id, model) => {
            return dispatch(events.updateEvent(id, model));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);