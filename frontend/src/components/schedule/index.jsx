import React, {Component} from 'react';
import {connect} from 'react-redux';
import {events} from "../../actions";
import "../../css/schedule.css";
import EventModal from "../modals/Event";
import moment from "moment";
import PropTypes from "prop-types";
import Modal from "../modals";
import ControlPanel from "./ControlPanel";
import ScheduleTable from "./ScheduleTable";
import {viewTypes} from "./types";

/**
 * Main schedule component.
 */

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            view: viewTypes.month,
            clickedDate: null,
            id: null,
            emptyEvent: {
                id: null,
                title: "",
                text: "",
                startDate: moment().toISOString(),
                finishDate: moment().hour(moment().hour() + 1).toISOString(),
                repeat_type: 0,
                notice: false,
                notification_type: 0,
                calendar: this.props.calendars ? this.props.calendars[0] : undefined,
            },

            event: {},
            notificationEvent: {},
            notifications: [],
            isOpen: false,
            isOpenNotification: false,
            isOpenNoCalendars: false
        };
    }

    componentDidMount() {
        this.updateEvents(this.props.selectedDate, this.props.calendars)
    };

    updateEvents(date, calendars) {
        this.props.loadEvents(date, calendars)
        this.props.loadNotifications(date, calendars).then(() => {
            this.setState({notifications: this.props.notifications});
            if (this.props.notifications !== []) {
                let event = this.props.notifications[this.props.notifications.length - 1];
                if (event) {
                    this.setState({
                        isOpenNotification: true,
                        notificationEvent: event,
                    });
                }
            }
        });
    };

    viewDay = (e, day) => {
        this.setState({view: viewTypes.day});
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
        if (this.state.isOpen) {
            this.setState({event: this.state.emptyEvent,});
            this.updateEvents(this.props.selectedDate, this.props.calendars)
        } else {
            if (this.props.calendars.length === 0) {
                this.toggleNoCalendarsModal()
                return
            }
        }
        this.setState({isOpen: !this.state.isOpen});
    };

    toggleNoCalendarsModal = () => this.setState({isOpenNoCalendars: !this.state.isOpenNoCalendars});

    complete = (event) => {
        if (event.id) {
            this.props.updateEvent(event.id, event).then(() => this.toggleModal());
        } else {
            this.props.addEvent(event).then(() => this.toggleModal());
        }
    };

    onDateClick = (day, hour) => {
        if (hour) day = moment(day.setHours(hour.getHours()));
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

    changeView = (view) => this.setState({view: view})

    setToday = () => this.props.changeDate(moment().startOf('day'))

    render() {
        return (
            <div className={'scheduler'}>
                <ControlPanel
                    changeView={this.changeView}
                    setToday={this.setToday}/>
                <ScheduleTable
                    view={this.state.view}
                    viewDay={this.viewDay}
                    onDateClick={this.onDateClick}
                    onEventClick={this.onEventClick}/>
                <EventModal
                    show={this.state.isOpen}
                    onCancel={this.toggleModal}
                    onOk={this.complete}
                    event={this.state.event}
                    date={this.state.clickedDate}/>
                <Modal
                    show={this.state.isOpenNotification}
                    onOk={this.dismissNotification}
                    header={"Notification about event \"" + this.state.notificationEvent.title + "\""}>
                    Event "{this.state.notificationEvent.title}" starts in {moment(this.state.notificationEvent.start_date).toLocaleString()}
                </Modal>
                <Modal
                    show={this.state.isOpenNoCalendars}
                    onOk={this.toggleNoCalendarsModal}
                    header={"Notification about calendars "}>
                    Please add at least one calendar to add new event.
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        events: state.events.events,
        notifications: state.events.notifications,
        calendars: state.calendars.calendars,
        selectedDate: state.calendars.selectedDate,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        loadEvents: (date, calendars) => dispatch(events.loadEvents(date, calendars)),
        loadNotifications: (date, calendars) => dispatch(events.loadNotifications(date, calendars)),
        addEvent: (model) => dispatch(events.addEvent(model)),
        updateEvent: (id, model) => dispatch(events.updateEvent(id, model)),
    }
};

Main.propTypes = {
    selectedDate: PropTypes.object,
    events: PropTypes.any,
    calendars: PropTypes.any,

    changeDate: PropTypes.func,
    toggleModalImport: PropTypes.func,
    changeCalendars: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);