import React, {Component} from 'react';
import "../css/schedule.css"
import Day from "./Day"
import Week from "./Week"
import Month from "./Month"
import PropTypes from "prop-types";
import {viewTypes} from "./types";

/**
 * Component for schedule views
 */
class ScheduleTable extends Component {
    render() {
        const {
            ...other
        } = this.props;

        let table;
        if (this.props.view === viewTypes.day) table = <Day {...other}/>;
        if (this.props.view === viewTypes.week) table = <Week {...other}/>;
        if (this.props.view === viewTypes.month) table = <Month {...other} />;

        return (
            <div className={'schedule'}>{table}</div>
        )
    }
}

ScheduleTable.propTypes = {
    view: PropTypes.number,
    events: PropTypes.any,

    onDateClick: PropTypes.func,
    onEventClick: PropTypes.func,
    viewDay: PropTypes.func,
};

export default ScheduleTable;