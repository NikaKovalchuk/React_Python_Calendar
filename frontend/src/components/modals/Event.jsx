import React, {Component} from 'react';
import "../../css/form.css";
import {events} from "../../actions";
import {connect} from "react-redux";
import moment from "moment";
import {repeatOptions, notificationOptions} from "./types";
import PropTypes from "prop-types";
import {modal as messages} from "../../messages";
import Modal from "./index";

/**
 * Event modal window
 *
 * @param {bool} show               Show or hide modal.
 * @param {object} date             Selected date.
 * @param {object} event            Current event if edit mode chosen.
 * @param {array} calendars         Actual calendar list.
 * @param {func} onCancel           onCancel function.
 * @param {func} onOK               onOk function.
 *
 */
class Event extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: "",
            text: "",
            id: this.props.id,
            start_date: moment(),
            finish_date: moment(),
            repeat_type: 0,
            notification_type: 0,
            notice: false,

            calendar: {},
            calendarId: undefined,

            isOpen: false,
            isOpenError: false,
            errorMessage: null,
        };
    }

    componentWillReceiveProps = (nextProps, nextContext) => {
        let searchValue = /\+[0-9]*:[0-9]*/

        if (nextProps.date != null) {
            /* Convert date to ISOformat to use it in datetime-local component*/
            let date = moment(nextProps.date).format();
            this.setState({
                start_date: date.replace(searchValue, '')
            })

            date = moment(date)
            date = date.hours(date.hours() + 1).format();
            this.setState({
                finish_date: date.replace(searchValue, ''),
                calendar: nextProps.calendars ? nextProps.calendars[0] : undefined,
                calendarId: nextProps.calendars[0] ? nextProps.calendars[0].id : undefined,
                id: nextProps.event.id,
                title: nextProps.event.title,
                text: nextProps.event.text,
                repeat_type: nextProps.event.repeat_type,
                notification_type: nextProps.event.notification_type,
            })
        }

        if (nextProps.event.id) {
            if (nextProps.event.start_date) {
                let date = moment(nextProps.event.start_date).format();
                this.setState({
                    start_date: date.replace(searchValue, '')
                })
            }
            if (nextProps.event.finish_date) {
                let date = moment(nextProps.event.finish_date).format();
                this.setState({
                    finish_date: date.replace(searchValue, '')
                })
            }
            if (nextProps.event.notification_type !== notificationOptions['No']) {
                this.setState({notice: true})
            }
            this.setState({
                id: nextProps.event.id,
                title: nextProps.event.title,
                text: nextProps.event.text,
                repeat_type: nextProps.event.repeat_type,
                notification_type: nextProps.event.notification_type,
                calendar: nextProps.event.calendar,
                calendarId: nextProps.event.calendar ? nextProps.event.calendar.id : 0,
            })
        }
    }

    selectNotification = () => {
         const options = notificationOptions ? notificationOptions.map((option) => (
            <option className="input"
                    key={Object.keys(option)[0]}
                    value={Object.keys(option)[0]}>
                {Object.values(option)[0]}
            </option>)) : {};
        return <select className="input"
                       value={this.state.notification_type}
                       onChange={(e) => {
                           this.setState({notification_type: e.target.value})
                       }}>
            {options}
        </select>;
    }

    selectRepeat = () => {
        const options = repeatOptions ? repeatOptions.map((option) => (
            <option className="input"
                    key={Object.keys(option)[0]}
                    value={Object.keys(option)[0]}>
                {Object.values(option)[0]}
            </option>)) : {};
        return <select className="input"
                       value={this.state.repeat_type}
                       onChange={(e) => {
                           this.setState({repeat_type: e.target.value})
                       }}>
            {options}
        </select>;
    }

    selectCalendar = () => {
        const options = this.props.calendars.map((calendar) => (
            <option className="input"
                    key={calendar.id}
                    value={calendar.id}>
                {calendar.title}
            </option>));
        return <select className="input"
                       value={this.state.calendarId}
                       onChange={(e) => this.changeCalendar(e.target.value)}>
            {options}
        </select>;
    };

    changeCalendar = (id) => {
        return this.props.calendars.map((calendar) => {
            if (calendar.id === +id) {
                this.setState({
                    calendar: calendar,
                    calendarId: calendar.id
                })
            }
            return "";
        });
    };

    onOk = () => {
        const event = {
            id: this.state.id,
            title: this.state.title,
            text: this.state.text,
            start_date: this.state.start_date,
            finish_date: this.state.finish_date,
            repeat_type: this.state.repeat_type,
            notification_type: this.state.notification_type,
            notice: this.state.notification_type !== notificationOptions['No'] ? true : false,
            calendar: this.state.calendar,
        };
        if (this.validate(event)) {
            this.props.onOk(event)
        }
    };

    showError = (error) => this.setState({ isOpenError: true, errorMessage: error });

    validate = (event) => {
        if (event.start_date > event.finish_date) {
            this.showError(messages.event.error.dateOrder);
            return false;
        }
        if (event.title === "" || !event.title || event.text === "" || !event.text) {
            this.showError(messages.event.error.fillFields);
            return false;
        }
        return true
    };

    delete = () => this.props.deleteEvent(this.state.id).then(() => this.props.onCancel());

    toggleModal = () => this.setState({isOpen: !this.state.isOpen});

    render() {
        if (!this.props.show) return null;

        const buttons = this.state.id ? <div className={'button-group'}>
                <button className={"btn btn-secondary"} onClick={this.props.onCancel}> CANCEL</button>
                <button className={"btn btn-danger"} onClick={this.toggleModal}> DELETE</button>
                <button className={"btn btn-secondary"} onClick={this.onOk}> OK</button>
            </div> : <div className={'button-group'}>
                <button className={"btn btn-secondary"} onClick={this.props.onCancel}> CANCEL</button>
                <button className={"btn btn-secondary"} onClick={this.onOk}> OK</button>
            </div>;
        const label = this.state.id ? <h1>Edit event "{this.props.event.title}"</h1> : <h1>New event</h1>;

        return (
            <div className="backdrop">
                <div className="modal-window event">
                    <div className="header">
                        {label}
                    </div>
                    <div className="modal-body">
                        <div className="form">
                            <form>
                                <div key={'gtitle'} className="group">
                                    <label className="label" key={'ltitle'} htmlFor={'title'}> Title </label>
                                    <input className="input" type={'text'} key={'title'} value={this.state.title}
                                           onChange={(e) => {
                                               this.setState({title: e.target.value})
                                           }}/>
                                </div>

                                <div key={'gtext'} className="group">
                                    <label className="label" key={'ltext'} htmlFor={'text'}> Text </label>
                                    <input className="input" type={'text'} key={'text'} value={this.state.text}
                                           onChange={(e) => {
                                               this.setState({text: e.target.value})
                                           }}/>
                                </div>

                                <div key={'gstart_date'} className="group">
                                    <label className="label" key={'lstart_date'} htmlFor={'start_date'}> Start
                                        Date </label>
                                    <input className="input" type={'datetime-local'} key={'start_date'}
                                           value={this.state.start_date}
                                           onChange={(e) => {
                                               this.setState({start_date: e.target.value})
                                           }}/>
                                </div>

                                <div key={'gfinish_date'} className="group">
                                    <label className="label" key={'lfinish_date'} htmlFor={'finish_date'}> Finish
                                        Date </label>
                                    <input className="input" type={'datetime-local'} key={'finish_date'}
                                           value={this.state.finish_date}
                                           onChange={(e) => {
                                               this.setState({finish_date: e.target.value})
                                           }}/>
                                </div>

                                <div key={'grepeat'} className="group">
                                    <label className="label" key={'lrepeat'} htmlFor={'repeat'}> Repeat </label>
                                    {this.selectRepeat()}
                                </div>

                                <div key={'gnotification'} className="group">
                                    <label className="label" key={'lnotification'}
                                           htmlFor={'notification'}> Notice </label>
                                    {this.selectNotification()}
                                </div>

                                <div key={'gcalendar'} className="group">
                                    <label className="label" key={'lcalendar'}
                                           htmlFor={'notification'}> Calendar </label>
                                    {this.selectCalendar()}
                                </div>

                            </form>
                        </div>
                    </div>
                    <div className="footer">
                        {buttons}
                    </div>
                    <Modal
                        show={this.state.isOpen}
                        onCancel={this.toggleModal}
                        onOk={this.delete}
                        header={"Remove event \"" + this.state.title + "\""}>
                        Are you sure you want to delete the event "{this.state.title}"?
                    </Modal>

                    <Modal
                        show={this.state.isOpenError}
                        onOk={() => this.setState({isOpenError: false, errorMessage: null})}
                        header={"Error"}>
                        {this.state.errorMessage}
                    </Modal>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        events: state.events,
        calendars: state.calendars.calendars,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteEvent: (id) => dispatch(events.deleteEvent(id)),
    }
}

Event.propTypes = {
    date: PropTypes.object,
    event: PropTypes.object,
    calendar: PropTypes.arrayOf(PropTypes.object),

    show: PropTypes.bool,

    onOk: PropTypes.func,
    onCancel: PropTypes.func
};


export default connect(mapStateToProps, mapDispatchToProps)(Event);