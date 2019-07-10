import React from "react";
import '../../css/calendar.css';
import moment from "moment";
import PropTypes from "prop-types";
import {endOfMonth, startOfMonth, startOfWeek} from "../../lib/date.js";
import {calendars} from "../../actions";
import {connect} from "react-redux";

const dateFormat = "D";

/**
 * Component for calendar table.
 * Contains table with days.
 *
 * @param {object} viewDate       Current displayed date.
 * @param {object} selectedDate   Selected date.
 * @param {func} onDateClick      onClick function.
 */
class Days extends React.Component {
    render() {
        const {
            viewDate,
            selectedDate,
            updateDate,
        } = this.props;

        const monthStart = startOfMonth(viewDate);

        let rows = [];
        let days = [];
        let day = startOfWeek(monthStart);
        let formattedDate = "";

        while (day <= endOfMonth(monthStart)) {
            for (let i = 0; i<7; i++) {
                const cloneDay = day;
                formattedDate = moment(day).format(dateFormat);
                days.push(
                    <div
                        className={`col cell ${!moment(day).isSame(monthStart, 'month') ? "disabled" :
                            moment(day).isSame(selectedDate, 'day') ? "selected" : ""}
                            ${moment(day).isSame(moment().startOf('day'), 'day') ? "today" : ""}`}
                        key={day}
                        onClick={() => updateDate(cloneDay._d)}>
                        <span className="number">{formattedDate}</span>
                    </div>
                );
                day = moment(day).add(1, 'day');
            }
            rows.push(
                <div className="row" key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="body">{rows}</div>;
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateDate: (date) => dispatch(calendars.updateSelectedDate(date)),
    }
};

const mapStateToProps = state => {
    return {
        viewDate: state.calendars.viewDate,
        selectedDate: state.calendars.selectedDate,
    }
};


Days.propTypes = {
    viewDate: PropTypes.object,
    selectedDate: PropTypes.object,
    updateDate: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Days);