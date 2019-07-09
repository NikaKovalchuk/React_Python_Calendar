import React, {Component} from 'react';
import "../../css/schedule.css";
import moment from "moment";
import Event from "./Event";
import PropTypes from "prop-types";
import {endOfDay, startOfDay} from "../../../lib/date";

class Day extends Component {
    render() {
        const {
            selectedDate,
            events,
            onDateClick,
            onEventClick,
        } = this.props;

        const hours = [];

        hours.push(
            <div className="day-title" key={selectedDate}>
                <span>{moment(selectedDate).format("D")}</span>
            </div>);

        let hour = startOfDay(selectedDate);

        while (hour <= endOfDay(selectedDate)) {
            const cloneHour = hour;
            hours.push(
                <div className="row" key={'row' + hour}>
                    <div className={'day-view-time'} key={'day-view-time'}>
                        <span>{moment(hour).format("hh:mm A")}</span>
                    </div>
                    <div className={'day-view-data'} key={'day-view-data'}
                         onClick={() => onDateClick(selectedDate, cloneHour)}>
                        <Event events={events}
                               day={selectedDate}
                               hour={cloneHour}
                               onEventClick={onEventClick}
                        />
                    </div>
                </div>
            );
            hour = moment(hour).add(1, 'hour')
        }

        return <div className="table">{hours}</div>;
    }
}

Day.propTypes = {
    selectedDate: PropTypes.object,
    events: PropTypes.any,

    onDateClick: PropTypes.func,
    onEventClick: PropTypes.func
};

export default Day;