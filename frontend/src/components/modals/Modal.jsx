import React from 'react';
import PropTypes from 'prop-types';
import "../../css/modal.css"

class Modal extends React.Component {

    onOk = () => {
        this.props.onOk()
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        return (
            <div className="backdrop" onClick={this.props.onCancel}>
                <div className="modal-window">
                    <div className="header">
                        {this.props.header}
                    </div>
                    <div className="modal-body">
                        {this.props.children}
                    </div>
                    <div className="footer">
                        <div className={'button-group'}>
                            <button className={"btn btn-secondary"} onClick={this.props.onCancel}> CANCEL</button>
                            <button className={"btn btn-secondary"} onClick={this.onOk}> OK</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Modal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
};

export default Modal;