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
 * @param {func} changeShow       Hide or show selected calendar.
 * @param {func} changeCalendars  Update calendar list.
 */
class CalendarsList extends React.Component {
    state = {
        isOpen: false,
        isOpenImport: false,
        calendar: {},
    };

    componentDidMount = () => {
        this.props.loadCalendars(false);
        this.props.loadCalendars(true);
    };

    toggleModalImport = () => this.setState({
        isOpenImport: !this.state.isOpenImport
    });

    toggleModal = (calendar) => {
        this.setState({
            calendar: calendar ? calendar : {},
            isOpen: !this.state.isOpen
        });
    };

    completeImport = (calendarsId) => {
        this.props.importCalendars(calendarsId);
        this.toggleModalImport();
    };

    changeShow = (e, calendar) => {
        e.stopPropagation();
        calendar.show = !calendar.show;
        this.props.updateCalendar(calendar.id, calendar);
    };

    complete = (calendar) => {
        if (calendar.id) {
            this.props.updateCalendar(calendar.id, calendar);
            this.setState({
                isOpen: !this.state.isOpen
            });
            return;
        }
        this.props.addCalendar(calendar);
        this.setState({isOpen: !this.state.isOpen});
    };

    render() {
        return (
            <div className={'calendars'}>
                <ControlPanel
                    toggleModal={this.toggleModal}
                    toggleModalImport={this.toggleModalImport}/>
                <Calendars
                    toggleModal={this.toggleModal}
                    changeShow={this.changeShow}/>
                <Calendar
                    show={this.state.isOpen}
                    onCancel={this.toggleModal}
                    onOk={this.complete}
                    calendar={this.state.calendar}/>
                <Import
                    show={this.state.isOpenImport}
                    onCancel={this.toggleModalImport}
                    onOk={this.completeImport}/>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadCalendars: (isImport) => dispatch(calendars.loadCalendars(isImport)),
        importCalendars: (calendarsId) => dispatch(
            calendars.importCalendars(calendarsId)),
        updateCalendar: (id, obj) => dispatch(calendars.updateCalendar(id, obj)),
        addCalendar: (obj) => dispatch(calendars.addCalendar(obj)),
    }
};

CalendarsList.propTypes = {
    changeShow: PropTypes.func,
    changeCalendars: PropTypes.func
};

export default connect(null, mapDispatchToProps)(CalendarsList);