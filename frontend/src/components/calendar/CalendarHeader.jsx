import React from "react";
import '../css/calendar.css';
import moment from "moment";
import PropTypes from "prop-types";
import {calendars} from "../../state/actions";
import {connect} from "react-redux";

/**
 * Component for calendar header.
 * Contains calendar navigation buttons.
 *
 * @param {object} viewDate       Current displayed date.
 * @param {func} onChangeDate     onChangeDate function.
 */
class CalendarHeader extends React.Component {
    render() {
        const dateFormat = "MMM YYYY";
        const {
            updateDate,
            viewDate
        } = this.props;

        return (
            <div className="header row flex-middle">
                <div className="col col-start"
                     onClick={() => updateDate(
                         moment(viewDate).add(-1, 'month'))}>
                    <div className={"icon"}> Prev</div>
                </div>
                <div className="col col-center">
                    <span>
                        {moment(viewDate).format(dateFormat)}
                    </span>
                </div>
                <div className="col col-end"
                     onClick={() => updateDate(
                         moment(viewDate).add(1, 'month'))}>
                    <div className="icon">Next</div>
                </div>
            </div>
        );

    }
}

const mapDispatchToProps = dispatch => ({
        updateDate: (date) => dispatch(calendars.updateViewDate(date)),
    });

const mapStateToProps = state => ({
        viewDate: state.calendars.viewDate
    });


CalendarHeader.propTypes = {
    viewDate: PropTypes.object,
    updateDate: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarHeader);