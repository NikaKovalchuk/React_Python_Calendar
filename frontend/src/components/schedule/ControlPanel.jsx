import React, {Component} from 'react';
import "../../css/schedule.css";
import PropTypes from "prop-types";
import {viewTypes} from "./types";
import Button from "./Button";

/**
 * Schedule control panel.
 *
 * @param {func} setToday
 * @param {func} changeView
 */
class ControlPanel extends Component {
    render() {
        return (
            <div>
                <div className={'today-button'}>
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <Button
                            title={"Today"}
                            onClick={() => this.props.setToday()}/>
                    </div>
                </div>

                <div className={'view-buttons'}>
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <Button
                            title={"Day"}
                            onClick={() => this.props.changeView(viewTypes.day)}
                        />
                        <Button
                            title={"Week"}
                            onClick={() => this.props.changeView(viewTypes.week)}
                        />
                        <Button
                            title={"Month"}
                            onClick={() => this.props.changeView(viewTypes.month)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

ControlPanel.propTypes = {
    setToday: PropTypes.func,
    changeView: PropTypes.func,
};

export default ControlPanel;