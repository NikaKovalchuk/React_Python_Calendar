import React from "react";
import '../../css/calendar.css';
import moment from "moment";
import PropTypes from "prop-types";

/**
 * Component for calendar header.
 * Contains calendar navigation buttons.
 *
 * @param {object} viewDate       onSubmit function.
 * @param {func} onChangeDate     Actual form errors.
 */
class CalendarHeader extends React.Component {
    render() {
        const dateFormat = "MMM YYYY";
        const {
            onChangeDate,
            viewDate
        } = this.props;

        return (
            <div className="header row flex-middle">
                <div className="col col-start"
                     onClick={() => onChangeDate(moment(viewDate).add(-1, 'month'))}>
                    <div className={"icon"}> Prev</div>
                </div>
                <div className="col col-center">
            <span>
              {moment(viewDate).format(dateFormat)}
            </span>
                </div>
                <div className="col col-end"
                     onClick={() => onChangeDate(moment(viewDate).add(1, 'month'))}>
                    <div className="icon">Next</div>
                </div>
            </div>
        );

    }
}

CalendarHeader.propTypes = {
    viewDate: PropTypes.object,
    onChangeDate: PropTypes.func
};

export default CalendarHeader;