import React, {Component} from 'react';
import "../../css/schedule.css"
import moment from "moment";
import PropTypes from "prop-types";
import MonthEvent from "./MonthEvent"

class Month extends Component {
    render() {
        const selectedDate = this.props.selectedDate;
        const monthStart = moment(selectedDate).startOf('month');
        const monthEnd = moment(monthStart).endOf('month');
        const startDate = moment(monthStart).startOf('week')
        const endDate = moment(monthEnd).endOf('week');

        let month = [];
        let week = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                week.push(
                    <div className={`month-view-day`}
                         onClick={() => this.props.onDateClick(cloneDay, null)}
                         key={day}>
                        <div className="number"
                             onClick={(e) => this.props.viewDay(e, cloneDay)}>{moment(day).format("D")}</div>
                        <MonthEvent today={cloneDay}
                                    events={this.props.events}
                                    onEventClick={this.props.onEventClick}
                                    viewDay={this.props.viewDay}
                        />
                    </div>
                );
                day = moment(day).add(1, 'day');
            }
            month.push(<div className="row" key={day + "row"}> {week} </div>);
            week = [];
        }
        return <div className="table">{month}</div>;
    }
}

Month.propTypes = {
    selectedDate: PropTypes.object,
    events: PropTypes.arrayOf(PropTypes.object),

    onDateClick: PropTypes.func,
    onEventClick: PropTypes.func,
    viewDay: PropTypes.func
};
export default Month;