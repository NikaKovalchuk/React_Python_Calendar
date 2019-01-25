import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";
import dateFns from "date-fns";
import "../css/schedule.css"
import EventModal from "./modals/EventModal";
import Modal from "./modals/Modal";

const viewType = {day: 0, week: 1, month: 2}
const eventsPosition = {top: 0, middle: 1, bottom: 2}

class Schedule extends Component {

    constructor(props) {
        super(props);

        this.state = {
            view: viewType.month,
            currentDate: this.props.currentDate,
            selectedDate: this.props.selectedDate,
            clickedDate: null,
            id: null,

            newEvent: {
                id: null,
                title: "",
                text: "",
                start_date: new Date().toISOString(),
                finish_date: new Date(new Date().setHours(new Date().getHours() + 1)).toISOString(),
                repeat: 0,
                notice: false,
                notification: 0,
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
        this.props.loadUser().then(response => {
            this.setState({user: this.props.auth.user});
        });
        this.updateEvents(this.state.selectedDate)
    }

    componentWillReceiveProps(props) {
        let update = false

        if (props.selectedDate) {
            if (props.selectedDate !== this.state.selectedDate) {
                if (new Date(props.selectedDate).getMonth() !== new Date(this.state.selectedDate).getMonth()) {
                    update = true
                }
                this.setState({selectedDate: props.selectedDate});
            }
        }

        if (update) {
            this.updateEvents(props.selectedDate)
        }
    }

    updateEvents(date) {
        const startDate = dateFns.startOfWeek(dateFns.startOfMonth(date)).toISOString();
        const finishDate = dateFns.endOfWeek(dateFns.endOfMonth(date)).toISOString();

        this.props.loadEvents(startDate, finishDate).then(response => {
            this.setState({events: this.props.events});
        });
        this.props.loadNotifications(startDate, finishDate).then(response => {
            this.setState({notifications: this.props.events});
            if (this.props.events !== []) {
                let event = this.props.events[this.props.events.length - 1]
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
        })
        e.stopPropagation();
    }

    dismissNotification = () => {
        let event = this.state.notificationEvent
        let events = this.state.notifications
        events.pop()
        event.notice = false
        this.props.updateEvent(event.id, event)

        if (events !== []) {
            let event = events[events.length - 1]
            this.setState({
                isOpenNotification: event ? true : false,
                notificationEvent: event ? event : {},
                notifications: events,
            });
        }
    }

    toggleModal = () => {
        if (this.state.isOpen === true) {
            this.setState({event: this.state.newEvent,})
            this.updateEvents(this.state.selectedDate)
        }
        this.setState({isOpen: !this.state.isOpen});
    }

    complite = (event) => {
        if (event.id) {
            this.props.updateEvent(event.id, event).then(response => {
                this.toggleModal()
            });
        } else {
            this.props.addEvent(event).then(response => {
                this.toggleModal()
            });
        }
    }


    onDateClick = (day, hour) => {
        if (hour != null) {
            day = new Date(day.setHours(hour.getHours()))
        }
        this.setState({
            event: {},
            clickedDate: day,
        });
        this.toggleModal()
    }

    onEventClick = (e, event) => {
        this.setState({
            event: event,
            clickedDate: null,
        });
        this.toggleModal()
        e.stopPropagation();
    }


    events(day, hour, elementClass, blockClass) {
        const result = [];
        let startOfDay = dateFns.startOfDay(day)
        let endOfDay = dateFns.endOfDay(day)
        let events = []

        for (let index = 0; index < this.state.events.length; index++) {
            let event = this.state.events[index]
            let start_date = new Date(event.start_date)
            let finish_date = new Date(event.finish_date)
            let add = false

            if (start_date <= endOfDay && finish_date >= startOfDay) {
                if (start_date >= startOfDay) {
                    if (finish_date <= endOfDay) {
                        if (start_date.getHours() <= hour && finish_date.getHours() >= hour)
                            add = true
                    } else {
                        if (start_date.getHours() <= hour)
                            add = true
                    }
                }

                if (start_date < startOfDay) {
                    if (finish_date < endOfDay) {
                        if (finish_date.getHours() >= hour)
                            add = true
                    } else
                        add = true
                }

                if (add === true) {
                    result.push(<div className={elementClass} key={event.id}
                                     onClick={(e) => this.onEventClick(e, event)}>{event.title}</div>)
                    events.push(event)
                }

            }
        }
        return <div className={blockClass}>{result}</div>;
    }

    dayTable() {
        const {selectedDate} = this.state;
        const dayStart = dateFns.startOfDay(selectedDate)
        const dayEnd = dateFns.endOfDay(selectedDate)
        const day = selectedDate
        const hours = [];

        let hour = dayStart;
        hours.push(<div className="day-title" key={day}><span>{dateFns.format(day, "D")}</span></div>);

        while (hour <= dayEnd) {
            const cloneHour = hour
            hours.push(
                <div className="row" key={'row' + hour}>
                    <div className={'day-view-time'} key={'day-view-time'}>
                        <span>{dateFns.format(hour, "hh:mm A")}</span>
                    </div>
                    <div className={'day-view-data'} key={'day-view-data'}
                         onClick={() => this.onDateClick(day, cloneHour)}>
                        {this.events(day, hour.getHours(), "day-event", "day-events")}
                    </div>
                </div>
            );
            hour = dateFns.addHours(hour, 1)
        }

        return <div className="table">{hours}</div>;
    }

    weekTable() {
        const {selectedDate} = this.state;
        const weekStart = dateFns.startOfWeek(selectedDate);
        const dayStart = dateFns.startOfDay(selectedDate)
        const dayEnd = dateFns.endOfDay(selectedDate)
        const hours = [];

        let week = [];
        let hour = dayStart;
        let day = weekStart;

        week.push(<div className="empty-week-title" key={'empty'}></div>);
        for (let i = 0; i < 7; i++) {
            week.push(
                <div className="week-view-day-title" key={day + '-week-view-day-title'}>
                    <span>{dateFns.format(day, "D")}</span>
                </div>
            );
            day = dateFns.addDays(day, 1);
        }
        hours.push(<div className="row" key={day}> {week} </div>);
        week = []

        while (hour <= dayEnd) {
            let day = weekStart;
            week.push(
                <div className="day-view-time" key={hour + "-day-view-time"}>
                    <span>{dateFns.format(hour, "hh:mm A")}</span>
                </div>
            );

            for (let i = 0; i < 7; i++) {
                const cloneHour = hour
                const cloneday = day
                week.push(
                    <div className="week-view-day" key={day + '-week-view-day'}
                         onClick={() => this.onDateClick(cloneday, cloneHour)}>
                        {this.events(day, hour.getHours(), "week-event", "week-events")}
                    </div>
                );
                day = dateFns.addDays(day, 1);
            }
            hours.push(<div className="row" key={day + ' ' + hour}> {week} </div>);
            week = [];
            hour = dateFns.addHours(hour, 1)
        }
        return <div className="table">{hours}</div>;
    }

    eventsMonth(today) {
        const begin_of_today = dateFns.startOfDay(today)
        const end_of_today = dateFns.endOfDay(today)
        const begin_of_week = dateFns.startOfWeek(today)
        const end_of_week = dateFns.endOfWeek(today)
        const result = [];
        const events_limit = 3;
        let events_for_today = [];
        let prevDayEventsPositions = [];

        for (let index = 0; index < this.state.events.length; index++) {
            let event = this.state.events[index]
            let finish_date = new Date(event.finish_date)
            let start_date = new Date(event.start_date)
            let event_width = 0

            if (finish_date < end_of_week && finish_date > begin_of_week && start_date > begin_of_week && start_date < end_of_week) {
                event_width = finish_date.getDate() - start_date.getDate()
            } else if (start_date > begin_of_week && start_date < end_of_week) {
                event_width = end_of_week.getDate() - start_date.getDate()
            } else if (finish_date < end_of_week && finish_date > begin_of_week) {
                event_width = finish_date.getDate() - begin_of_week.getDate()
            } else {
                event_width = end_of_week.getDate() - begin_of_week.getDate()
            }

            const width = 90 + event_width * 100
            if (start_date < end_of_today && finish_date > begin_of_today) {
                events_for_today.push(event)
            }

            if (start_date <= end_of_today && start_date >= begin_of_today) {
                let eventStyle = {width: width + '%',};
                if (finish_date > end_of_week) {
                    eventStyle = {
                        width: width + 5 + '%',
                        borderRadius: "5px 0px 0px 5px",
                        marginRight: 0,
                    };
                }

                if (events_for_today.length > events_limit) {
                    result.pop()
                    let buttonStyle = {}
                    if (result.length < events_limit - 1) {
                        let margin = 1
                        if (result.length === 0) margin = 26
                        buttonStyle = {marginTop: margin + '%',}
                    }
                    result.push(<div className={"more-events"} style={buttonStyle}
                                     onClick={(e) => this.viewDay(e, today)}
                                     key={"more"}> View all events </div>)
                } else {
                    if (result.length === 0 && events_for_today.length > 1) {
                        eventStyle = {
                            marginTop: events_for_today.length > 2 ? '60px' : ' 30px',
                            width: width + '%',
                        }
                        event.position = 1
                    }
                    result.push(<div className={'month-event'} style={eventStyle} key={event.id}
                                     onClick={(e) => this.onEventClick(e, event)}>{event.title}</div>)
                }

            } else if (start_date < begin_of_week && finish_date > begin_of_week && begin_of_today <= begin_of_week) {
                let radius = "0px 5px 5px 0px"
                if (finish_date > end_of_week) {
                    radius = "0px"
                    width = width+5
                }
                let eventStyle = {
                    width: width + 5 + '%',
                    borderRadius: radius,
                    marginLeft: 0,
                };
                result.push(<div className={'month-event empty'} style={eventStyle}
                                 key={event.id + "_" + event.title + today}
                                 onClick={(e) => this.onEventClick(e, event)}>{event.title}</div>)
            }

        }

        return <div className="month-events">{result}</div>;
    }

    monthTable() {
        const {selectedDate} = this.state;
        const monthStart = dateFns.startOfMonth(selectedDate);
        const monthEnd = dateFns.endOfMonth(monthStart);
        const startDate = dateFns.startOfWeek(monthStart);
        const endDate = dateFns.endOfWeek(monthEnd);

        let month = [];
        let week = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                week.push(
                    <div className={`month-view-day ${
                        !dateFns.isSameMonth(day, monthStart) ? "disabled"
                            : dateFns.isSameDay(day, selectedDate) ? "selected" : ""}`}
                         onClick={() => this.onDateClick(cloneDay, null)}
                         key={day}>
                        <div className="number" onClick={(e) => this.viewDay(e, cloneDay)}>{dateFns.format(day, "D")}</div>
                        {this.eventsMonth(day)}
                    </div>
                );
                day = dateFns.addDays(day, 1);
            }
            month.push(<div className="row" key={day + "row"}> {week} </div>);
            week = [];
        }
        return <div className="table">{month}</div>;
    }

    shedule() {
        let table;

        if (this.state.view === viewType.day) {
            table = this.dayTable()
        }
        if (this.state.view === viewType.week) {
            table = this.weekTable()
        }
        if (this.state.view === viewType.month) {
            table = this.monthTable()
        }
        return (
            <div className={'shedule'}>
                {table}
            </div>
        )
    }

    buttons() {
        return (
            <div>
                <div className={'today-button'}>
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => this.props.changeDate(this.state.currentDate)}>Today
                        </button>
                    </div>
                </div>

                <div className={'view-buttons'}>
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => this.setState({view: viewType.day})}>Day
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => this.setState({view: viewType.week})}>Week
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => this.setState({view: viewType.month})}>Month
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className={'tall'}>

                {this.buttons()}
                {this.shedule()}

                <EventModal show={this.state.isOpen} onCancel={this.toggleModal} onOk={this.complite}
                            event={this.state.event} date={this.state.clickedDate}></EventModal>
                <Modal show={this.state.isOpenNotification} onOk={this.dismissNotification}
                       header={"Notification about event \"" + this.state.notificationEvent.title + "\""}>
                    Event "{this.state.notificationEvent.title}" starts
                    in {new Date(this.state.notificationEvent.start_date).toLocaleString()}
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        events: state.events,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => {
            return dispatch(auth.loadUser());
        },
        loadEvents: (startDate, finishDate) => {
            return dispatch(events.loadEvents(startDate, finishDate));
        },
        loadNotifications: (startDate, finishDate) => {
            return dispatch(events.loadNotifications(startDate, finishDate));
        },
        addEvent: (model) => {
            return dispatch(events.addEvent(model));
        },
        updateEvent: (id, model) => {
            return dispatch(events.updateEvent(id, model));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);