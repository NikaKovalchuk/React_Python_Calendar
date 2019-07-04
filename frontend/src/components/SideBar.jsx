import React, {Component} from 'react';
import Calendar from "./calendar";
import CalendarsList from "./calendarsList";
import "../css/main.css";
import PropTypes from "prop-types";

class SideBar extends Component {
    render() {
        const {
            selectedDate,
            changeDate,
            changeCalendars,
            calendars,
        } = this.props;

        return (
            <div className={'side-bar'}>
                <Calendar
                    selectedDate={selectedDate}
                    changeDate={changeDate}/>
                <CalendarsList
                    calendars={calendars}
                    changeCalendars={changeCalendars} />
            </div>
        )
    }
}

SideBar.propTypes = {
    selectedDate: PropTypes.any,
    changeDate: PropTypes.func,
    calendars: PropTypes.array,
    changeCalendars: PropTypes.func,
};

export default SideBar;