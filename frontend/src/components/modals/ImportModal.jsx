import React, {Component} from 'react';
import "../../css/form.css"
import {events} from "../../actions";
import {connect} from "react-redux";
import Modal from "./Modal";

class ImportModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            search: "",
            isOpen: false,
            calendars: {},
            chosenCalendars: [],
            isOpenError: false,
            errorMessage: null,
        }
    }

    componentDidMount(nextProps, nextContext) {
        this.props.loadCalendars().then(response => {
            this.setState({
                calendars: this.props.events,
            });
        });
    }

    onOk = () => {
        if (this.state.chosenCalendars.length == 0) {
            this.setState({
                isOpenError: true,
                errorMessage: "Select one or more calendars to add"
            })
        } else {
            let calendarsId = []
            for (let index = 0; index < this.state.chosenCalendars.length; index++) {
                calendarsId.push(this.state.chosenCalendars[index].id)
            }
            this.props.onOk(calendarsId)
        }
        this.setState({
            search: "",
            chosenCalendars: []
        })

    };

    onCancel=() =>{
        this.setState({
            search: "",
            chosenCalendars: []
        })
        this.props.onCancel()
    }

    validate = (event) => {
        let error = null
        if (event.start_date > event.finish_date) {
            error = "Finish Date must be greater than  Start date"
        }
        if (event.title === "" || event.title === undefined || event.text === "" || event.text === undefined) {
            error = "Please fill in all fields."
        }
        if (error !== null) {
            this.setState({
                isOpenError: true,
                errorMessage: error
            })
            return false
        }
        return true
    }

    delete = () => {
        this.props.deleteCalendar(this.state.id).then(response => {
            this.props.onCancel()
        })
    };

    onClickCalendar(calendar) {
        let add = true
        let chosenCalendars = this.state.chosenCalendars
        for (let index = 0; index < this.state.chosenCalendars.length; index++) {
            if (calendar == this.state.chosenCalendars[index]) {
                add = false
                chosenCalendars.splice(index, 1)
            }
        }
        if (add == true) {
            chosenCalendars.push(calendar)
        }
        this.setState({
            chosenCalendars: chosenCalendars
        })
    }

    search = () => {
        let result = []
        for (let index = 0; index < this.state.calendars.length; index++) {
            let calendar = this.state.calendars[index]
            let calendarClass = "variant";
            for (let index = 0; index < this.state.chosenCalendars.length; index++) {
                if (calendar == this.state.chosenCalendars[index]) {
                    calendarClass += " chosen";
                }
            }
            if ((calendar.name.indexOf(this.state.search) + 1) || this.state.search == "") {
                result.push(<div className={calendarClass} key={calendar.id}
                                 onClick={() => this.onClickCalendar(calendar)}>{calendar.name} </div>)
            }
        }
        return <div>{result}</div>
    }


    render() {
        if (!this.props.show) {
            return null;
        }

        return (
            <div className="backdrop">
                <div className="modal-window event">
                    <div className="header">
                        <h1>Import calendar</h1>
                    </div>
                    <div className="modal-body">
                        <div className="form">
                            <form>
                                <div key={'gname'} className="group">
                                    <label className="label" key={'lsearch'}
                                           htmlFor={'search'}> Search </label>
                                    <input className="input" type={'text'} key={'search'} value={this.state.search}
                                           onChange={(e) => {
                                               this.setState({search: e.target.value})
                                           }}/>
                                </div>

                                <div className={"variants"}>
                                    {this.search()}
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="footer">
                        <div className={'button-group'}>
                            <button className={"btn btn-secondary"} onClick={this.onCancel}> CANCEL</button>
                            <button className={"btn btn-secondary"} onClick={this.onOk}> OK</button>
                        </div>
                    </div>
                </div>

                <Modal show={this.state.isOpenError} onOk={() => {
                    this.setState({isOpenError: false, errorMessage: null})
                }} header={"Error"}>
                    {this.state.errorMessage}
                </Modal>
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
        loadCalendars: () => {
            return dispatch(events.loadCalendars(true));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportModal);