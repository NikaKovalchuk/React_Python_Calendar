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

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            view: viewTypes.month,
            selectedDate: this.props.selectedDate,
            clickedDate: null,
            id: null,
            calendars: this.props.calendars,
            calendarsId: [],
            emptyEvent: {
                id: null,
                title: "",
                text: "",
                startDate: moment().toISOString(),
                finishDate: moment().hour(moment().hour() + 1).toISOString(),
                repeat: 0,
                notice: false,
                notification: 0,
                calendar: this.props.calendars ? this.props.calendars[0] : undefined,
            },

            event: {},
            notificationEvent: {},
            notifications: [],
            events: [],
            isOpen: false,
            isOpenNotification: false,
            isOpenNoCalendars: false
        };
    }

    componentWillReceiveProps(props) {
        let update = false;
        let calendarsId = []
        if (props.selectedDate) {
            if (props.selectedDate !== this.state.selectedDate) {
                if (moment(props.selectedDate).month() !== moment(this.state.selectedDate).month()) {
                    update = true
                }
                this.setState({selectedDate: props.selectedDate});
            }
        }
        if (props.calendars.data) {
            if (props.calendars.data !== this.state.calendars) {
                this.setState({
                    calendars: this.props.calendars.data
                })
                for (let index = 0; index < props.calendars.data.length; index++) {
                    let calendar = props.calendars.data[index]
                    if (calendar.show === true) {
                        calendarsId.push(calendar.id)
                    }
                }
                update = true
            }
        }
        if (update) {
            this.setState({
                calendars: props.calendars.data,
                calendarsId: calendarsId
            });
            this.updateEvents(props.selectedDate, calendarsId)
        }
    }

    updateEvents(date, calendarsId) {
        this.props.loadEvents(date, calendarsId).then(() => {
            this.setState({events: this.props.events.data});
        });
        this.props.loadNotifications(date, calendarsId).then(() => {
            this.setState({notifications: this.props.events.notifications});
            if (this.props.events.notifications !== []) {
                let event = this.props.events.notifications[this.props.events.notifications.length - 1];
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
        const date = day._d;
        this.setState({
            selectedDate: date,
            view: viewTypes.day
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
        if (this.state.isOpen) {
            this.setState({event: this.state.emptyEvent,});
            this.updateEvents(this.state.selectedDate, this.state.calendarsId)
        } else {
            if (this.state.calendars.length === 0) {
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

    render() {
        return (
            <div className={'scheduler'}>
                <ControlPanel
                    changeView={this.changeView}
                    changeDate={this.props.changeDate}/>
                <ScheduleTable
                    view={this.state.view}
                    selectedDate={this.props.selectedDate}
                    events={this.props.events.data}
                    viewDay={this.viewDay}
                    onDateClick={this.onDateClick}
                    onEventClick={this.onEventClick}/>
                <EventModal
                    show={this.state.isOpen}
                    onCancel={this.toggleModal}
                    onOk={this.complete}
                    event={this.state.event}
                    date={this.state.clickedDate}
                    calendars={this.state.calendars}/>
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
        events: state.events,
        calendars: state.calendars,
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