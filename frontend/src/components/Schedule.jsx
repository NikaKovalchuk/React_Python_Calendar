import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";
import dateFns from "date-fns";
import "../css/schedule.css"
import EventModal from "./modals/EventModal";

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
            },
            event: {},
            events: {},

            isOpen: false,
        };
        this.changeView = this.changeView.bind(this);
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
    }

    changeView(newView) {
        this.setState({view: newView})
    }

    toggleModal = () => {
        if (this.state.isOpen === true) {
            this.setState({event: this.state.newEvent,})
        }
        this.setState({isOpen: !this.state.isOpen});
        this.updateEvents(this.state.selectedDate)
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

    changeDate = day => {
        this.props.changeDate(day);
    }


    renderButtons() {
        return (
            <div>
                <div className={'today-button'}>
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => this.changeDate(this.state.currentDate)}>Today
                        </button>
                    </div>
                </div>

                <div className={'view-buttons'}>
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => this.changeView(viewType.day)}>Day
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => this.changeView(viewType.week)}>Week
                        </button>
                        <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => this.changeView(viewType.month)}>Month
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    renderEventsDay(day, hour) {
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

                if (add === true) {
                    result.push(<div className={'day-event'} key={event.id + "_" + event.title}
                                     onClick={(e) => this.onEventClick(e, event)}>{event.title}</div>)
                    events.push(event)
                }

            }
        }
        return <div className="day-events">{result}</div>;
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
                        {this.renderEventsDay(day, hour.getHours())}
                    </div>
                </div>
            );
            hour = dateFns.addHours(hour, 1)
        }

        return <div className="table">{hours}</div>;
    }

    renderEventsWeek(day, hour) {
        const result = [];
        let events = []
        let startOfDay = dateFns.startOfDay(day)
        let endOfDay = dateFns.endOfDay(day)

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

                if (add === true) {
                    result.push(<div className={'week-event'} key={event.id + "_" + event.title}
                                     onClick={(e) => this.onEventClick(e, event)}>{event.title}</div>)
                    events.push(event)
                }
            }
        }
        return <div className="week-events">{result}</div>;
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
                        {this.renderEventsWeek(day, hour.getHours())}
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

    renderEventsMonth(today) {
        const begin_of_today = dateFns.startOfDay(today)
        const end_of_today = dateFns.endOfDay(today)
        const begin_of_week = dateFns.startOfWeek(today)
        const end_of_week = dateFns.endOfWeek(today)
        const result = [];
        const events_limit = 3;

        let events_for_today = [];
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
            if (start_date<end_of_today && finish_date>begin_of_today) {
                events_for_today.push(event)
            }

            if (start_date <= end_of_today && start_date >= begin_of_today) {
                const eventStyle = {
                    width: width + '%',
                };

                if (events_for_today.length > events_limit) {
                    result.pop()
                    result.push(<div className={'more-events'} style={eventStyle}
                                     key={"more"}> {events_for_today.length - events_limit + 1} more events</div>)
                } else {
                    result.push(<div className={'month-event'} style={eventStyle} key={event.id}
                                     onClick={(e) => this.onEventClick(e, event)}>{event.title}</div>)
                }

            } else if (start_date < begin_of_week && finish_date > begin_of_week && begin_of_today <= begin_of_week) {
                const eventStyle = {width: width + '%'};
                result.push(<div className={'month-event empty'} style={eventStyle}
                                 key={event.id + "_" + event.title + today}
                                 onClick={(e) => this.onEventClick(e, event)}>{event.title}</div>)
            }

        }
        return <div className="month-events">{result}</div>;
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
        addEvent: (model) => {
            return dispatch(events.addEvent(model));
        },
        updateEvent: (id, model) => {
            return dispatch(events.updateEvent(id, model));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);