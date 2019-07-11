import React from "react";
import '../css/calendar.css';
import moment from "moment";
import PropTypes from "prop-types";
import {endOfMonth, startOfMonth, startOfWeek} from "../../lib/date.js";
import {calendars} from "../../state/actions";
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

    getStyle = (day, monthStart, selectedDate) => {
        const isSelected = !moment(day).isSame(monthStart, 'month') ?
                "disabled" :
                moment(day).isSame(selectedDate, 'day') ?
                    "selected" :
                    "";
        const isToday = moment(day).isSame(
            moment().startOf('day'), 'day') ? " today" : "";
        return isSelected + isToday;
    };

    render() {
        const {
            viewDate,
            selectedDate,
            updateDate,
        } = this.props;

        const monthStart = startOfMonth(viewDate);
        let day = startOfWeek(monthStart);

        let rows = [];
        let days = [];

        while (day <= endOfMonth(monthStart)) {
            for (let i = 0; i<7; i++) {
                const cloneDay = day;
                let formattedDate = moment(day).format(dateFormat);
                const style = this.getStyle(day, monthStart, selectedDate);
                days.push(
                    <div
                        className={`col cell ${style}`}
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
const mapDispatchToProps = dispatch => ({
        updateDate: (date) => dispatch(calendars.updateSelectedDate(date)),
    });

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