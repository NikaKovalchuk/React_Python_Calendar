import React, {Component} from 'react';
import "../../css/form.css"
import {events} from "../../actions";
import {connect} from "react-redux";
import Info from "./Info"

class Calendar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            id: undefined,
            access: 1,
            color: this.getRandomColor(),
            isOpen: false,
            accessOptions: [{0: 'Public'}, {1: 'Private'}], // TODO : move it somewhere
            isOpenError: false,
            errorMessage: null,
        };
    }


    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.calendar != undefined && nextProps.calendar.id != undefined) {
            this.setState({
                name: nextProps.calendar.name,
                access: nextProps.calendar.access,
                color: nextProps.calendar.color,
                id: nextProps.calendar.id,
            })
        } else {
            this.setState({
                name: "",
                access: 1,
                color: this.getRandomColor(),
                id: undefined,
            })
        }
    }

    getRandomColor() {
        var letters = '0123456789abcdef';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    selectAccess() {
        let options = []
        options = this.state.accessOptions.map((o) => {
            o.key = Object.keys(o)[0]
            o.value = Object.values(o)[0]
            return (
                <option className="input"
                        key={o.key}
                        value={o.key}>
                    {o.value}</option>
            );
        });
        return <select className="input" value={this.state.access}
                       onChange={(e) => {
                           this.setState({access: e.target.value})
                       }}
        >{options}</select>
    }

    onOk = () => {
        let calendar = {
            id: this.state.id,
            name: this.state.name,
            access: this.state.access,
            color: this.state.color,
        }
        if (this.state.name == ""){
             this.setState({
                isOpenError: true,
                errorMessage: "Please fill in all fields"
            })
        }else  this.props.onOk(calendar)
    };

    delete = () => {
        this.props.deleteCalendar(this.state.id).then(response => {
            this.props.onCancel()
        })
    };

    toggleModal = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    render() {
        if (!this.props.show) {
            return null;
        }

        let buttons, label;
        if (this.state.id !== undefined) {
            buttons = <div className={'button-group'}>
                <button className={"btn btn-secondary"} onClick={this.props.onCancel}> CANCEL</button>
                <button className={"btn btn-danger"} onClick={this.toggleModal}> DELETE</button>
                <button className={"btn btn-secondary"} onClick={this.onOk}> OK</button>
            </div>
            label = <h1>Edit calendar "{this.props.calendar.name}"</h1>
        } else {
            buttons = <div className={'button-group'}>
                <button className={"btn btn-secondary"} onClick={this.props.onCancel}> CANCEL</button>
                <button className={"btn btn-secondary"} onClick={this.onOk}> OK</button>
            </div>
            label = <h1>New calendar</h1>
        }

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
                    <Info show={this.state.isOpen} onCancel={this.toggleModal} onOk={this.delete}
                          header={"Remove calendar \"" + this.state.name + "\""}>
                        Are you sure you want to delete the calendar "{this.state.name}"?
                    </Info>
                    <Info show={this.state.isOpenError} onOk={() => {
                        this.setState({isOpenError: false, errorMessage: null})
                    }} header={"Error"}>
                        {this.state.errorMessage}
                    </Info>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        events: state.events,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteCalendar: (id) => {
            return dispatch(events.deleteCalendar(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);