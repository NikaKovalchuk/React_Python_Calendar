import React, {Component} from 'react';
import "../../css/schedule.css"
import moment from "moment";
import Event from "./Event"
import PropTypes from "prop-types";

class Day extends Component {
    render() {
        console.log(this.props)
        const selectedDate = this.props.selectedDate;
        const dayStart = moment(selectedDate).startOf('day')
        const dayEnd = moment(selectedDate).endOf('day');
        const day = selectedDate;
        const hours = [];

        let hour = dayStart;
        hours.push(<div className="day-title" key={day}><span>{moment(day).format("D")}</span></div>);

        while (hour <= dayEnd) {
            const cloneHour = hour;
            hours.push(
                <div className="row" key={'row' + hour}>
                    <div className={'day-view-time'} key={'day-view-time'}>
                        <span>{moment(hour).format("hh:mm A")}</span>
                    </div>
                    <div className={'day-view-data'} key={'day-view-data'}
                         onClick={() => this.props.onDateClick(day, cloneHour)}>
                        <Event events={this.props.events}
                               day={day}
                               hour={cloneHour}
                               onEventClick={this.props.onEventClick}
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