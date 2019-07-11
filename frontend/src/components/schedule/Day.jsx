import React, {Component} from 'react';
import "../css/schedule.css";
import moment from "moment";
import Event from "./Event";
import PropTypes from "prop-types";
import {getHourIndexes} from "../../lib/schedule";
import {connect} from "react-redux";

/**
 * Day schedule view.
 *
 * @param {} selectedDate
 * @param {func} onDateClick
 * @param {func} onEventClick
 */
class Day extends Component {
    render() {
        const {
            selectedDate,
            onDateClick,
            onEventClick,
        } = this.props;

        const hours = getHourIndexes();
        const day = hours.map((hour) => {
            return (
                <div className="row" key={'row' + hour}>
                    <div className={'day-view-time'}
                         key={'day-view-time'}>
                        <span>{moment(hour).format("hh:mm A")}</span>
                    </div>
                    <div className={'day-view-data'}
                         key={'day-view-data'}
                         onClick={() => onDateClick(selectedDate, hour)}>
                        <Event day={selectedDate}
                               hour={hour}
                               onEventClick={onEventClick}
                        />
                    </div>
                </div>
            )});

        return (
            <div className="table">
                <div className="day-title" key={selectedDate}>
                    <span>{moment(selectedDate).format("D")}</span>
                </div>
                {day}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedDate: state.calendars.selectedDate
    }
};

Day.propTypes = {
    selectedDate: PropTypes.any,
    onDateClick: PropTypes.func,
    onEventClick: PropTypes.func
};

export default connect(mapStateToProps, null)(Day);