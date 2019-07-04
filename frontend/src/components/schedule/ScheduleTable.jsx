import React, {Component} from 'react';
import "../../css/schedule.css"
import Day from "./Day"
import Week from "./Week"
import Month from "./Month"
import PropTypes from "prop-types";

const viewType = {day: 0, week: 1, month: 2};

class ScheduleTable extends Component {
    render() {
        const {
            ...other
        } = this.props;

        let table;
        if (this.props.view === viewType.day) table = <Day {...other}/>;
        if (this.props.view === viewType.week) table = <Week {...other}/>;
        if (this.props.view === viewType.month) table = <Month {...other} />;

        return (
            <div className={'shedule'}>{table}</div>
        )
    }
}

ScheduleTable.propTypes = {
    view: PropTypes.number,
    selectedDate: PropTypes.object,
    events: PropTypes.any,

    onDateClick: PropTypes.func,
    onEventClick: PropTypes.func,
    viewDay: PropTypes.func,
};

export default ScheduleTable;