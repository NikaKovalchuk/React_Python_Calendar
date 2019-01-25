import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";
import dateFns from "date-fns";
import "../css/schedule.css"
import EventModal from "./modals/EventModal";
import Modal from "./modals/Modal";

const viewType = {day: 1, week: 2, month: 3}

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

    toggleModal = () => {
        if (this.state.isOpen == true) {
            this.setState({event: this.state.newEvent,})
            this.updateEvents(this.state.selectedDate)
        }
        this.setState({isOpen: !this.state.isOpen});
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

    renderButtons() {
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

    renderEvents(day, hour, elementClass, blockClass){
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
                        if (start_date.getHours() <= hour && finish_date.getHours() >= hour) {
                            add = true
                        }
                    } else {
                        if (start_date.getHours() <= hour) {
                            add = true
                        }
                    }
                }

                if (start_date < startOfDay) {
                    if (finish_date < endOfDay) {
                        if (finish_date.getHours() >= hour) {
                            add = true
                        }
                    } else {
                        add = true
                    }
                }

                if (add == true) {
                    result.push(<div className={elementClass} key={event.id}
                                     onClick={(e) => this.onEventClick(e, event)}>{event.title}</div>)
                    events.push(event)
                }

            }
        }
        return <div className={blockClass}>{result}</div>;
    }

    renderEventsMonth(day) {
        const result = [];
        let events = []
        let start_day = dateFns.endOfDay(day)
        let end_day = dateFns.startOfDay(day)

        for (let index = 0; index < this.state.events.length; index++) {
            let event = this.state.events[index]
            let start_date = new Date(event.start_date)
            let finish_date = new Date(event.finish_date)

            if (start_date <= start_day && finish_date >= end_day) {
                result.push(<div className={'month-event'} key={event.id + "_" + event.title}
                                 onClick={(e) => this.onEventClick(e, event)}>{event.title}</div>)
                events.push(event)
            }

        }
        return <div className="month-events">{result}</div>;
    }

    
    renderDayTable() {
        const {selectedDate} = this.state;
        const dayStart = dateFns.startOfDay(selectedDate)
        const dayEnd = dateFns.endOfDay(selectedDate)
        const day = selectedDate
        const timeFormat = "HH:mm";
        const hours = [];
        const dateFormat = "D";

        let hour = dayStart;
        let formattedDate = dateFns.format(day, dateFormat);

        hours.push(<div className="day-title" key={formattedDate}><span>{formattedDate}</span></div>);

        while (hour <= dayEnd) {
            const cloneHour = hour
            let formattedTime = dateFns.format(hour, timeFormat);

            hours.push(
                <div className="row" key={'row' + hour}>
                    <div className={'day-view-time'} key={'day-view-time'}>
                        <span>{formattedTime}</span>
                    </div>
                    <div className={'day-view-data'} key={'day-view-data'}
                         onClick={() => this.onDateClick(day, cloneHour)}>
                        {this.renderEvents(day, hour.getHours(), "day-event", "day-events")}
                    </div>
                </div>
            );
            hour = dateFns.addHours(hour, 1)
        }

        return <div className="table">{hours}</div>;
    }

    renderWeekTable() {
        const {selectedDate} = this.state;
        const weekStart = dateFns.startOfWeek(selectedDate);
        const dayStart = dateFns.startOfDay(selectedDate)
        const dayEnd = dateFns.endOfDay(selectedDate)
        const dateFormat = "D";
        const timeFormat = "HH:mm";
        const hours = [];

        let days = [];
        let hour = dayStart;
        let day = weekStart;

        days.push(<div className="empty-week-title" key={'empty'}></div>);

        for (let i = 0; i < 7; i++) {
            let formattedDate = dateFns.format(day, dateFormat);
            days.push(
                <div className="week-view-day-title" key={formattedDate + '-week-view-day-title'}>
                    <span>{formattedDate}</span>
                </div>
            );
            day = dateFns.addDays(day, 1);
        }

        hours.push(<div className="row" key={day}> {days} </div>);
        days = []

        while (hour <= dayEnd) {
            let day = weekStart;
            let formattedTime = dateFns.format(hour, timeFormat);

            days.push(
                <div className="day-view-time" key={formattedTime + "-day-view-time"}>
                    <span>{formattedTime}</span>
                </div>
            );
            for (let i = 0; i < 7; i++) {
                const cloneHour = hour
                const cloneday = day

                days.push(
                    <div className="week-view-day" key={day + '-week-view-day'}
                         onClick={() => this.onDateClick(cloneday, cloneHour)}>
                        {this.renderEvents(day, hour.getHours(), "week-event", "week-events")}
                    </div>
                );
                day = dateFns.addDays(day, 1);
            }
            hours.push(
                <div className="row" key={day + ' ' + hour}>
                    {days}
                </div>
            );
            days = [];
            hour = dateFns.addHours(hour, 1)
        }
        return <div className="table">{hours}</div>;
    }

    renderMonthTable() {
        const {selectedDate} = this.state;
        const monthStart = dateFns.startOfMonth(selectedDate);
        const monthEnd = dateFns.endOfMonth(monthStart);
        const startDate = dateFns.startOfWeek(monthStart);
        const endDate = dateFns.endOfWeek(monthEnd);
        const dateFormat = "D";

        let rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                formattedDate = dateFns.format(day, dateFormat);

                days.push(
                    <div className={`month-view-day ${
                        !dateFns.isSameMonth(day, monthStart) ? "disabled"
                            : dateFns.isSameDay(day, selectedDate) ? "selected" : ""}`}
                         onClick={() => this.onDateClick(cloneDay, null)}
                         key={day}>
                        <span className="number">{formattedDate}</span>
                        {this.renderEventsMonth(day)}
                    </div>
                );
                day = dateFns.addDays(day, 1);
            }
            rows.push(<div className="row" key={day + "row"}> {days} </div>);
            days = [];
        }
        return <div className="table">{rows}</div>;
    }

    renderTable() {
        let table;
        if (this.state.view === viewType.day) {
            table = this.renderDayTable()
        } else if (this.state.view === viewType.week) {
            table = this.renderWeekTable()
        } else {
            table = this.renderMonthTable()
        }
        return (
            <div className={'shedule'}>
                {table}
            </div>
        )
    }

    render() {
        return (
            <div className={'tall'}>
                {this.renderButtons()}
                {this.renderTable()}
                <EventModal show={this.state.isOpen} onCancel={this.toggleModal} onOk={this.complite}
                            event={this.state.event} date={this.state.clickedDate}></EventModal>
                <Modal show={this.state.isOpenNotification} onOk={this.dismissNotification}
                       header={"Notification about event \"" + this.state.notificationEvent.title + "\""}>
                    Event "{this.state.notificationEvent.title}" starts in {this.state.notificationEvent.start_date}
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