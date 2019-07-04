import React from 'react';
import "../../css/modal.css"
import PropTypes from "prop-types";
import Modal from "./index"

/**
 * Info modal with plain text.
 * Contains header, body and footer with buttons panel.
 *
 * @param {func} onCancel       onCancel function.
 * @param {func} onOk           onOk function.
 * @param {string} header       Modal title.
 * @param {} children           Modal text.
 * @param {bool} show           If modal should be shown.
 */
class Info extends React.Component {

    render() {
        return (
            <Modal
                show={this.props.show}
                onCancel={this.props.onCancel}
                onOk={this.props.onOk}
                header={this.props.header}
                children={this.props.children}
            />
        );
    }
}

Info.propTypes = {
    onCancel: PropTypes.func,
    onOk : PropTypes.func,
    header : PropTypes.string,
    show : PropTypes.bool,
    children: PropTypes.any,
};

export default Info;
