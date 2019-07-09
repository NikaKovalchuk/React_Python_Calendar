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
        const result = this.props.calendars.map((calendar) => {
            const colorStyle = {backgroundColor: calendar.color};
            return (
                <div
                    className={"element"}
                    key={calendar.id}
                    onClick={() => this.props.toggleModal(calendar)}>
                <div className={"name"}>
                    {calendar.title}
                </div>
                <div className={"control-panel"}>
                    <div
                        className={"show"}
                        onClick={(e) => this.props.changeShow(e, calendar)}>
                        <input
                            type="checkbox"
                            checked={calendar.show}/>
                    </div>
                    <div
                        className={"color"}
                        style={colorStyle}>
                    </div>
                </div>
            </div>)
        });
        return <div className={'calendars-list'}>{result}</div>;
    };
}

Calendars.propTypes = {
    calendars: PropTypes.any,
    changeShow: PropTypes.func,
    toggleModal: PropTypes.func,
};

export default Calendars;