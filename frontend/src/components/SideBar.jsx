import React, {Component} from 'react';
import Calendar from "./calendar";
import CalendarsList from "./calendarsList";
import "../css/main.css";

class SideBar extends Component {
    render() {
        return (
            <div className={'side-bar'}>
                <Calendar/>
                <CalendarsList/>
            </div>
        )
    }
}

export default SideBar;