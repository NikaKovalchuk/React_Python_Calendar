import React from "react";
import '../../css/calendar.css';
import moment from "moment";
import {startOfWeek} from "../../lib/date.js";

/**
 * Component for days name row.
 */
class NameOfDays extends React.Component {
    render() {
        const dateFormat = "dd";
        const days = [];
        const startDate = startOfWeek();

        for (let i = 0; i < 7; i++) {
            days.push(
                <div
                    className="col col-center"
                    key={i}>
                    {moment(startDate).add(i, 'day').format(dateFormat)}
                </div>
            );
        }
        return <div className="days row">{days}</div>;
    }
}

export default NameOfDays;