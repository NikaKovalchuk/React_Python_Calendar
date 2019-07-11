import React, {Component} from 'react';
import "../css/schedule.css";
import PropTypes from "prop-types";

/**
 * Button for schedule control panel.
 *
 * @param {func} onClick
 * @param {func} changeView
 */
class Button extends Component {
    render() {
        return (
            <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={this.props.onClick}>
                {this.props.title}
            </button>
        )
    }
}

Button.propTypes = {
    onClick: PropTypes.func,
    title: PropTypes.string,
};

export default Button;