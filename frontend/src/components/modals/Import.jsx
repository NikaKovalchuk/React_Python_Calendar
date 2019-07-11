import React, {Component} from 'react';
import "../../css/form.css";
import {calendars} from "../../actions";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {modal as messages} from "../../messages";
import Modal from "./index";

/**
 * Calendar import modal window
 *
 * @param {bool} show               Show or hide modal.
 * @param {} calendars              Actual calendar options.
 * @param {func} onCancel           onCancel function.
 * @param {func} onOK               onOk function.
 * @param {func} updateCalendars    updateCalendars function.
 *
 */
class Import extends Component {

    initState = {
            search: "",
            chosenCalendars: [],
            isOpen: false,
            isOpenError: false,
            errorMessage: null,
        };

    state = {...this.initState};


    cleanState = () => this.setState({...this.initState});

    onOk = () => {
        if (this.state.chosenCalendars.length === 0) {
            this.setState({
                isOpenError: true,
                errorMessage: messages.import.error.noCalendar,
            })
        } else {
            const calendarsId = this.state.chosenCalendars?
                this.state.chosenCalendars.map((calendar) => (calendar.id)):{};
            this.props.onOk(calendarsId);
            console.log(this.state)
            this.cleanState()
        }
    };

    onCancel = () => {
        this.cleanState();
        this.props.onCancel();
    };

    onClickCalendar = (calendar) => {
        let chosenCalendars = this.state.chosenCalendars;
        const add = this.state.chosenCalendars.filter((chosenCalendar) => (calendar === chosenCalendar)).length === 0;
        if (add) chosenCalendars.push(calendar);
        else {
            const index = chosenCalendars.indexOf(calendar);
            chosenCalendars.splice(index, 1);
        }
        this.setState({
            chosenCalendars: chosenCalendars
        });
    };

    search = () => {
        const result = this.props.calendars ?  this.props.calendars.map((calendar) => {
            const chosen = this.state.chosenCalendars.filter(
                (chosenCalendar) => (calendar === chosenCalendar)).length > 0;
            const calendarClass = chosen ? "variant chosen" :  "variant";
            if ((calendar.title.indexOf(this.state.search) + 1) || this.state.search === "") {
                return <div className={calendarClass}
                            key={calendar.id}
                            onClick={() => this.onClickCalendar(calendar)}>
                    {calendar.title}
                </div>
            }
            return "";
        }) : "";
        return result;
    };

    render() {
        if (!this.props.show) return null;
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

                <Modal show={this.state.isOpenError}
                       onOk={() => this.setState({isOpenError: false, errorMessage: null})}
                       header={"Error"}>
                    {this.state.errorMessage}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        calendars: state.calendars.import,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        loadCalendars: () => dispatch(calendars.loadCalendars(true)),
    }
};

Import.propTypes = {
    show: PropTypes.bool,
    calendars: PropTypes.array,

    onCancel: PropTypes.func,
    loadCalendars: PropTypes.func,
    onOk: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Import);