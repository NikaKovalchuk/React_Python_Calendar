import React from "react";
import '../../css/calendar.css';
import moment from "moment";
import PropTypes from "prop-types";

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
            onDateClick,
        } = this.props;

        const monthStart = moment(viewDate).startOf('month');
        const startDate = moment(monthStart).startOf('week');
        const endDate = moment(monthStart).endOf('month');

        let rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i<7; i++) {
                const cloneDay = day;
                formattedDate = moment(day).format(dateFormat);
                days.push(
                    <div
                        className={`col cell ${!moment(day).isSame(monthStart, 'month') ? "disabled" :
                            moment(day).isSame(selectedDate, 'day') ? "selected" : ""}
                            ${moment(day).isSame(moment().startOf('day'), 'day') ? "today" : ""}`}
                        key={day}
                        onClick={() => onDateClick(cloneDay._d)}>
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

Days.propTypes = {
    viewDate: PropTypes.object,
    selectedDate: PropTypes.object,
    onDateClick: PropTypes.func
};

export default Days;