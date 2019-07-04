import React, {Component} from 'react';
import "../../css/form.css"
import {calendars} from "../../actions";
import {connect} from "react-redux";
import Modal from "./index";
import {modal as messages} from "../../messages";
import PropTypes from "prop-types";

class Calendar extends Component {

    state = {
        name: "",
        id: undefined,
        public: false,
        color: this.getRandomColor(),
        isOpen: false,
        accessOptions: [{true: 'Public'}, {false: 'Private'}],
        isOpenError: false,
        errorMessage: null,
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.calendar !== undefined && nextProps.calendar.id !== undefined) {
            this.setState({
                name: nextProps.calendar.name,
                public: nextProps.calendar.public,
                color: nextProps.calendar.color,
                id: nextProps.calendar.id,
            })
        } else {
            this.setState({
                name: "",
                public: false,
                color: this.getRandomColor(),
                id: undefined,
            })
        }
    }

    getRandomColor = () => {
        const signs = '0123456789abcdef';
        let color = '#';
        for (let i = 0; i < 6; i++) color += signs[Math.floor(Math.random() * 16)];
        return color;
    };

    selectAccess = () => {
        const options = this.state.accessOptions.map((option) => (
            <option className="input"
                    key={Object.keys(option)[0]}
                    value={Object.keys(option)[0]}>
                {Object.values(option)[0]}
            </option>));
        return <select className="input"
                       value={this.state.public}
                       onChange={(e) => {
                           this.setState({public: e.target.value})
                       }}>
            {options}
        </select>
    };

    onOk = () => {
        let calendar = {
            id: this.state.id,
            name: this.state.name,
            public: this.state.public,
            color: this.state.color,
        };
        if (this.state.name === ""){
             this.setState({
                isOpenError: true,
                errorMessage: messages.calendar.error.emptyField
            })
        }
        else this.props.onOk(calendar)
    };

    delete = () => {
        this.props.deleteCalendar(this.state.id).then(() => {
            this.props.updateCalendars(this.props.calendars.data)
            this.props.onCancel()
        })
    };

    toggleModal = () => this.setState({isOpen: !this.state.isOpen});

    render() {
        if (!this.props.show) return null;

        const buttons = this.state.id ? <div className={'button-group'}>
                <button className={"btn btn-secondary"} onClick={this.props.onCancel}> CANCEL</button>
                <button className={"btn btn-danger"} onClick={this.toggleModal}> DELETE</button>
                <button className={"btn btn-secondary"} onClick={this.onOk}> OK</button>
            </div> : <div className={'button-group'}>
                <button className={"btn btn-secondary"} onClick={this.props.onCancel}> CANCEL</button>
                <button className={"btn btn-secondary"} onClick={this.onOk}> OK</button>
            </div>;
        const label = this.state.id ? <h1>Edit calendar "{this.props.calendar.name}"</h1> : <h1>New calendar</h1>;

        return (
            <div className="backdrop">
                <div className="modal-window event">
                    <div className="header">
                        {label}
                    </div>
                    <div className="modal-body">
                        <div className="form">
                            <form>
                                <div key={'gname'} className="group">
                                    <label className="label" key={'lname'} htmlFor={'name'}> Name </label>
                                    <input className="input" type={'text'} key={'name'} value={this.state.name}
                                           onChange={(e) => {
                                               this.setState({name: e.target.value})
                                           }}/>
                                </div>

                                <div key={'gcolor'} className="group">
                                    <label className="label" key={'lcolor'}
                                           htmlFor={'color'}> Color </label>
                                    <input className="input" type="color" value={this.state.color} onChange={(e) => {
                                        this.setState({color: e.target.value})
                                    }}></input>
                                </div>

F
                                <div key={'gaccess'} className="group">
                                    <label className="label" key={'laccess'}
                                           htmlFor={'access'}> Access </label>
                                    {this.selectAccess()}
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="footer">
                        {buttons}
                    </div>
                    <Modal
                        show={this.state.isOpen}
                        onCancel={this.toggleModal}
                        onOk={this.delete}
                        header={"Remove calendar \"" + this.state.name + "\""}>
                        Are you sure you want to delete the calendar "{this.state.name}"?
                    </Modal>
                    <Modal
                        show={this.state.isOpenError}
                        onOk={() => this.setState({isOpenError: false, errorMessage: null})}
                        header={"Error"}>
                        {this.state.errorMessage}
                    </Modal>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteCalendar: (id) => {
            return dispatch(calendars.deleteCalendar(id));
        },
    }
}

const mapStateToProps = state => {
    return {
        events: state.events,
        calendars: state.calendars
    }
}

Calendar.propTypes = {
    show : PropTypes.bool,
    calendar: PropTypes.any,

    onCancel: PropTypes.func,
    onOk : PropTypes.func,
    updateCalendars : PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);