import React, {Component} from 'react';
import Calendar from "./calendar";
import CalendarsList from "./calendarsList";
import "../css/main.css";
import PropTypes from "prop-types";

class SideBar extends Component {
    render() {
        const {
            changeCalendars,
            calendars,
        } = this.props;

        return (
            <div className={'side-bar'}>
                <Calendar/>
                <CalendarsList
                    calendars={calendars}
                    changeCalendars={changeCalendars} />
            </div>
        )
    }
}

SideBar.propTypes = {
    calendars: PropTypes.array,
    changeCalendars: PropTypes.func,
};

export default SideBar;