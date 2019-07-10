import React from "react";
import '../../css/calendars.css';
import {calendars} from "../../actions";
import {connect} from "react-redux";
import Calendar from "../modals/Calendar";
import Import from "../modals/Import";
import PropTypes from "prop-types";
import ControlPanel from "./ControlPanel";
import Calendars from "./Calendars";

/**
 * Component for calendar list.
 *
 * @param {object} calendars      User calendars.
 * @param {func} changeShow       Hide or show selected calendar.
 * @param {func} changeCalendars  Update calendar list.
 */
class CalendarsList extends React.Component {
    state = {
        calendars: this.props.calendars,
        isOpen: false,
        isOpenImport: false,
        calendar: {},
    }

    componentDidMount = () => this.loadCalendars();

    toggleModalImport = () => this.setState({isOpenImport: !this.state.isOpenImport});

    updateCalendars = (calendars) => this.setState({calendars});

    loadCalendars = () => {
        this.props.loadCalendars().then(() => {
            this.setState({calendars: this.props.calendars.data});
            this.props.changeCalendars(this.props.calendars.data)
        });
    };

    toggleModal = (calendar) => {
        console.log(calendar)
        this.setState({
            calendar: calendar ? calendar : {},
            isOpen: !this.state.isOpen
        });
    };

    completeImport = (calendarsId) => {
        this.props.importCalendars(calendarsId).then(() => {
            this.setState({
                calendars: this.props.calendars.data
            });
            this.toggleModalImport()
        });
    };

    changeShow = (e, calendar) => {
        e.stopPropagation();
        calendar.show = !calendar.show;
        this.props.updateCalendar(calendar.id, calendar).then(() => {
            this.setState({
                calendars: this.props.calendars.data
            })
        });
    };

    complete = (calendar) => {
        if (calendar.id) {
            this.props.updateCalendar(calendar.id, calendar).then(() => {
                this.setState({
                    calendars: this.props.calendars.data,
                    isOpen: !this.state.isOpen
                })
            });
            return;
        }
        this.props.addCalendar(calendar).then(() => {
            this.setState({
                calendars: this.props.calendars.data,
                isOpen: !this.state.isOpen
            })
        });
    };

    render() {
        console.log(this.state.calendar)
        return (
            <div className={'calendars'}>
                <ControlPanel
                    toggleModal={this.toggleModal}
                    toggleModalImport={this.toggleModalImport}/>
                <Calendars
                    calendars={this.state.calendars}
                    toggleModal={this.toggleModal}
                    changeShow={this.changeShow}/>
                <Calendar
                    show={this.state.isOpen}
                    onCancel={this.toggleModal}
                    onOk={this.complete}
                    calendar={this.state.calendar}
                    updateCalendars={this.updateCalendars}/>
                <Import
                    show={this.state.isOpenImport}
                    onCancel={this.toggleModalImport}
                    onOk={this.completeImport}
                    updateCalendars={this.updateCalendars}/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        calendars: state.calendars
    }
};

const mapDispatchToProps = dispatch => {
    return {
        loadCalendars: () => dispatch(calendars.loadCalendars()),
        importCalendars: (calendarsId) => dispatch(calendars.importCalendars(calendarsId)),
        updateCalendar: (id, obj) => dispatch(calendars.updateCalendar(id, obj)),
        addCalendar: (obj) => dispatch(calendars.addCalendar(obj)),
    }
};

CalendarsList.propTypes = {
    calendars: PropTypes.array,

    changeShow: PropTypes.func,
    changeCalendars: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarsList);