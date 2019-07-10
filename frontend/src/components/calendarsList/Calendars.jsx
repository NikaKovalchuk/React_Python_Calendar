import React from "react";
import '../../css/calendars.css';
import PropTypes from "prop-types";

/**
 * Component for list of calendars.
 *
 * @param {object} calendars   User calendars.
 * @param {func} changeShow    Hide or show calendar on the schedule.
 * @param {func} toggleModal   Hide or show calendar edit modal.
 */
class Calendars extends React.Component {
    render() {
        const result =  "";
        return <div className={'calendars-list'}>{result}</div>;
    };
}

Calendars.propTypes = {
    calendars: PropTypes.array,
    changeShow: PropTypes.func,
    toggleModal: PropTypes.func,
};

export default Calendars;