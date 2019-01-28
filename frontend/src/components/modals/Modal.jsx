import React from 'react';
import "../../css/modal.css"

class Modal extends React.Component {

    render() {
        if (!this.props.show) {
            return null;
        }

        let buttons;
        if (this.props.onCancel) {
            buttons = <div className={'button-group'}>
                <button className={"btn btn-secondary"} onClick={this.props.onCancel}> CANCEL</button>
                <button className={"btn btn-secondary"} onClick={this.props.onOk}> OK</button>
            </div>
        } else {
            buttons = <div className={'button-group'}>
                <button className={"btn btn-secondary"} onClick={this.props.onOk}> OK</button>
            </div>
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
                        {buttons}
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;