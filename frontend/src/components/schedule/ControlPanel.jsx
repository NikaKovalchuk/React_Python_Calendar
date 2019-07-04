import React, {Component} from 'react';
import "../../css/schedule.css";
import moment from "moment";
import PropTypes from "prop-types";
import {viewTypes} from "./types";

/**
 * Schedule control panel.
 *
 * @param {func} changeDate
 * @param {func} changeView
 */
class ControlPanel extends Component {
    render() {
        return (
            <div>
                <div className={'today-button'}>
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <button type="button" className="btn btn-secondary btn-sm"
                                onClick={() => this.props.changeDate(moment().startOf('day'))}>
                            Today
                        </button>
                    </div>
                </div>

                <div className={'view-buttons'}>
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => this.props.changeView(viewTypes.day)}>
                            Day
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => this.props.changeView(viewTypes.week)}>
                            Week
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => this.props.changeView(viewTypes.month)}>
                            Month
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

ControlPanel.propTypes = {
    changeDate: PropTypes.func,
    changeView: PropTypes.func,
};

export default ControlPanel;