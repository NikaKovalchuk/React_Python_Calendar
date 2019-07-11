import React from "react";
import '../../css/calendar.css';
import NameOfDays from "./NameOfDays";
import CalendarHeader from "./CalendarHeader";
import Days from "./Days";

/**
 * Component for calendar picker.
 * Contains table with days.
 */
class Calendar extends React.Component {
    render() {
        return (
            <div className={'calendar'}>
                <CalendarHeader/>
                <NameOfDays/>
                <Days/>
            </div>
        );
    }
}

export default Calendar;