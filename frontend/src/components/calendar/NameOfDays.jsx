import React from "react";
import '../css/calendar.css';
import moment from "moment";
import {startOfWeek} from "../../lib/date.js";
import {getDayIndexesForWeek} from "../../lib/schedule";

/**
 * Component for days name row.
 */
class NameOfDays extends React.Component {
    render() {
        const dateFormat = "dd";
        const startDate = startOfWeek();

        const days = getDayIndexesForWeek();
        const result = days.map((day) => {
            return (
                <div
                    className="col col-center"
                    key={day}>
                    {moment(startDate).add(day, 'day').format(dateFormat)}
                </div>
            )
        });
        return <div className="days row">{result}</div>;
    }
}

export default NameOfDays;