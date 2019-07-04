import React from 'react';
import "../../css/modal.css"
import PropTypes from "prop-types";

/**
 * Common component for modals.
 * Contains header, body and footer with buttons panel.
 *
 * @param {func} onCancel       onCancel function.
 * @param {func} onOk           onOk function.
 * @param {string} header       Modal title.
 * @param {} children     Modal text.
 * @param {bool} show           If modal should be shown.
 */
class Modal extends React.Component {

    render() {
        const {
            onCancel,
            onOk,
            header,
            show,
            children
        } = this.props;

        if (!show) return null;

        const buttons = onCancel ?
            <div className={'button-group'}>
                <button class Name={"btn btn-secondary"} onClick={onCancel}> CANCEL</button>
                <button className={"btn btn-secondary"} onClick={onOk}> OK</button>
            </div> :
            <div className={'button-group'}>
                <button className={"btn btn-secondary"} onClick={onOk}> OK</button>
            </div>;

        return (
            <div className="backdrop" onClick={onCancel}>
                <div className="modal-window">
                    <div className="header">
                        {header}
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="footer">
                        {buttons}
                    </div>
                </div>
            </div>
        );
    }
}

Modal.propTypes = {
    onCancel: PropTypes.func,
    onOk : PropTypes.func,
    header : PropTypes.string,
    show : PropTypes.bool,
    children: PropTypes.any,
};

export default Modal;
