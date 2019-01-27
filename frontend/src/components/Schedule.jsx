import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";
import dateFns from "date-fns";
import "../css/schedule.css"
import EventModal from "./modals/EventModal";
import Modal from "./modals/Modal";

const viewType = {day: 0, week: 1, month: 2};

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
                startDate: new Date().toISOString(),
                finishDate: new Date(new Date().setHours(new Date().getHours() + 1)).toISOString(),
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
        let update = false;

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
    };


    onDateClick = (day, hour) => {
        if (hour != null) {
            day = new Date(day.setHours(hour.getHours()))
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

    events(day, hour) {
        const result = [];
        let startOfDay = dateFns.startOfDay(day);
        let endOfDay = dateFns.endOfDay(day);
        let events = [];

        const eventHeight = 20;
        const betweenDaysHeight = 10;
        const dayLength = 23;
        const eventMargin = 5;

        const className = "week-and-day-event";
        const classBegin = " begin";
        const classMiddle = " middle";
        const classEnd = " end";

        for (let index = 0; index < this.state.events.length; index++) {
            let event = this.state.events[index];
            let startDate = new Date(event.start_date);
            let finishDate = new Date(event.finish_date);
            let add = false;
            let eventStyle = [];
            let height = eventHeight;

            if (startDate <= endOfDay && finishDate >= startOfDay) {
                let currentClass = className;
                if (startDate >= startOfDay) {
                    if (startDate.getHours() == hour) {
                        add = true
                    }
                    if (finishDate <= endOfDay) {
                        height = height + (finishDate.getHours() - hour) * (eventHeight + betweenDaysHeight)
                    } else {
                        height = height + (dayLength - hour) * (eventHeight + betweenDaysHeight) + eventMargin;
                        currentClass += classBegin
                    }
                }

                if (startDate < startOfDay) {
                    if (startOfDay.getHours() == hour) {
                        add = true
                    }
                    if (finishDate <= endOfDay) {
                        height = height + (finishDate.getHours() - hour) * (eventHeight + betweenDaysHeight) + eventMargin;
                        currentClass += classEnd
                    } else
                        height = height + (dayLength - hour) * (eventHeight + betweenDaysHeight) + eventMargin * 2;
                    currentClass += classMiddle
                }

                if (add === true) {
                    eventStyle = {
                        height: height + 'px',
                    };
                    result.push(<div className={currentClass} key={event.id} style={eventStyle}
                                     onClick={(e) => this.onEventClick(e, event)}>{event.title}</div>);
                    events.push(event)
                }

            }
        }
        return <div>{result}</div>;
    }

    dayTable() {
        const {selectedDate} = this.state;
        const dayStart = dateFns.startOfDay(selectedDate);
        const dayEnd = dateFns.endOfDay(selectedDate);
        const day = selectedDate;
        const hours = [];

        let hour = dayStart;
        hours.push(<div className="day-title" key={day}><span>{dateFns.format(day, "D")}</span></div>);

        while (hour <= dayEnd) {
            const cloneHour = hour;
            hours.push(
                <div className="row" key={'row' + hour}>
                    <div className={'day-view-time'} key={'day-view-time'}>
                        <span>{dateFns.format(hour, "hh:mm A")}</span>
                    </div>
                    <div className={'day-view-data'} key={'day-view-data'}
                         onClick={() => this.onDateClick(day, cloneHour)}>
                        {this.events(day, hour.getHours())}
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
        const dayStart = dateFns.startOfDay(selectedDate);
        const dayEnd = dateFns.endOfDay(selectedDate);
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
        week = [];

        while (hour <= dayEnd) {
            let day = weekStart;
            week.push(
                <div className="day-view-time" key={hour + "-day-view-time"}>
                    <span>{dateFns.format(hour, "hh:mm A")}</span>
                </div>
            );

            for (let i = 0; i < 7; i++) {
                const cloneHour = hour;
                const cloneday = day;
                week.push(
                    <div className="week-view-day" key={day + '-week-view-day'}
                         onClick={() => this.onDateClick(cloneday, cloneHour)}>
                        {this.events(day, hour.getHours())}
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
        const eventsLimit = 3;
        const cellWidth = 100;
        const eventMargin = 5;
        const eventWidth = cellWidth - 2 * eventMargin;
        const eventheight = 25;

        const beginOfToday = dateFns.startOfDay(today);
        const endOfToday = dateFns.endOfDay(today);
        const beginOfWeek = dateFns.startOfWeek(today);
        const endOfWeek = dateFns.endOfWeek(today);
        const result = [];
        let eventsForToday = [];

        const className = "month-event";
        const classBegin = " begin";
        const classMiddle = " middle";
        const classEnd = " end";

        for (let index = 0; index < this.state.events.length; index++) {
            let event = this.state.events[index];
            let finishDate = new Date(event.finish_date);
            let startDate = new Date(event.start_date);
            let numberOfDays = 0;
            let currentClass = className;

            if (finishDate < endOfWeek && finishDate > beginOfWeek && startDate > beginOfWeek && startDate < endOfWeek) {
                numberOfDays = finishDate.getDay() - startDate.getDay()
            } else if (startDate > beginOfWeek && startDate < endOfWeek) {
                numberOfDays = endOfWeek.getDay() - startDate.getDay()
            } else if (finishDate < endOfWeek && finishDate > beginOfWeek) {
                numberOfDays = finishDate.getDay() - beginOfWeek.getDay()
            } else {
                numberOfDays = endOfWeek.getDay() - beginOfWeek.getDay()
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
                        if (result.length === 0) margin = 25;
                        buttonStyle = {marginTop: margin + '%',}
                    }
                    result.push(<div className={"more-events"} style={buttonStyle}
                                     onClick={(e) => this.viewDay(e, today)}
                                     key={"more"}> View all events </div>)
                } else {
                    if (finishDate > endOfWeek) {
                        currentClass += classBegin;
                        width += 5
                    }
                    let eventStyle = {width: width + '%',};
                    if (result.length === 0 && eventsForToday.length > 1) {
                        let margin = eventheight + eventMargin;
                        if (eventsForToday.length > 2) {
                            margin *= 2
                        }
                        eventStyle = {
                            marginTop: margin + 'px',
                            width: width + '%',
                        }

                    }
                    result.push(<div className={currentClass} style={eventStyle} key={event.id}
                                     onClick={(e) => this.onEventClick(e, event)}>{event.title}</div>)
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
                };
                result.push(<div className={currentClass} style={eventStyle}
                                 key={event.id + "_" + event.title + today}
                                 onClick={(e) => this.onEventClick(e, event)}>{event.title}</div>)
            }

        }

        console.log(eventsForToday);
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
                    <div className={`month-view-day`}
                         onClick={() => this.onDateClick(cloneDay, null)}
                         key={day}>
                        <div className="number"
                             onClick={(e) => this.viewDay(e, cloneDay)}>{dateFns.format(day, "D")}</div>
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
};

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
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);