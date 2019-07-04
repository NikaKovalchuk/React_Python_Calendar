import React from "react";
import '../../css/calendars.css'
import PropTypes from "prop-types";

class ControlPanel extends React.Component {
    render() {
        return (
            <div>
                <div className=" btn-group wide btn-group-toggle btn-group-center" data-toggle="buttons">
                    <button type="button"
                            className="btn wide btn-secondary btn-sm"
                            onClick={() => this.props.toggleModal()}>
                        Add calendar
                    </button>
                    <button type="button"
                            className="btn wide btn-secondary btn-sm"
                            onClick={() => this.props.toggleModalImport()}>
                        Import calendar
                    </button>
                </div>
            </div>
        )
    }
}

ControlPanel.propTypes = {
    toggleModalImport: PropTypes.func,
    toggleModal: PropTypes.func,
};

export default ControlPanel;