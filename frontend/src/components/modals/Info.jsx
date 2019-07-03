import React from 'react';
import "../../css/modal.css"
import PropTypes from "prop-types";

class Info extends React.Component {

    render() {
        if (!this.props.show) return null;

        const buttons = this.props.onCancel ?
            <div className={'button-group'}>
                <button class Name={"btn btn-secondary"} onClick={this.props.onCancel}> CANCEL</button>
                <button className={"btn btn-secondary"} onClick={this.props.onOk}> OK</button>
            </div> :
            <div className={'button-group'}>
                <button className={"btn btn-secondary"} onClick={this.props.onOk}> OK</button>
            </div>

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

Info.propTypes = {
    onCancel: PropTypes.func,
    onOk : PropTypes.func,
    header : PropTypes.string,
    show : PropTypes.bool
};

export default Info;