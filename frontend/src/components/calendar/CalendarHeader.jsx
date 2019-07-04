import React from "react";
import '../../css/calendar.css'
import moment from "moment";
import PropTypes from "prop-types";

class CalendarHeader extends React.Component {
    render() {
        const dateFormat = "MMM YYYY";
        const {
            changeViewDate,
            viewDate
        } = this.props;

        return (
            <div className="header row flex-middle">
                <div className="col col-start"
                     onClick={() => changeViewDate(moment(viewDate).add(-1, 'month'))}>
                    <div className={"icon"}> Prev</div>
                </div>
                <div className="col col-center">
            <span>
              {moment(viewDate).format(dateFormat)}
            </span>
                </div>
                <div className="col col-end"
                     onClick={() => changeViewDate(moment(viewDate).add(1, 'month'))}>
                    <div className="icon">Next</div>
                </div>
            </div>
        );

    }
}

CalendarHeader.propTypes = {
    viewDate: PropTypes.object,
    changeDate: PropTypes.func
};

export default CalendarHeader;