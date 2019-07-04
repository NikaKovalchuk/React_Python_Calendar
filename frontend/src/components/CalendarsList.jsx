import React from "react";
import '../css/calendars.css'
import {calendars} from "../actions";
import {connect} from "react-redux";
import Calendar from "./modals/Calendar";
import Import from "./modals/Import";
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


class Calendars extends React.Component {
    render() {
        const result = this.props.calendars.map((calendar) => {
            const colorStyle = {backgroundColor: calendar.color};
            return (<div className={"element"} key={calendar.id} onClick={() => this.props.toggleModal(calendar)}>
                <div className={"name"}>{calendar.name}</div>
                <div className={"control-panel"}>
                    <div className={"show"} onClick={(e) => this.props.changeShow(e, calendar)}>
                        <input type="checkbox" checked={calendar.show} onChange={() => {
                        }}></input>
                    </div>
                    <div className={"color"} style={colorStyle}></div>
                </div>
            </div>)
        });
        return <div className={'calendars-list'}>{result}</div>;
    }

}

Calendars.propTypes = {
    calendars: PropTypes.any,

    changeShow: PropTypes.func,
    toggleModal: PropTypes.func
};

class CalendarsList extends React.Component {
    state = {
        calendars: this.props.calendars,
        isOpen: false,
        isOpenImport: false,
        calendar: {}
    }

    componentDidMount = () => this.loadCalendars();

    loadCalendars() {
        this.props.loadCalendars().then(() => {
            this.setState({calendars: this.props.calendars.data});
            this.props.changeCalendars(this.props.calendars.data)
        });
    }

    toggleModal = (calendar) => {
        if (this.state.isOpen === true) {
            this.setState({
                calendar: calendar,
            })
        } else {
            if (calendar) {
                this.setState({
                    calendar: calendar
                });
            } else {
                this.setState({
                    calendar: {},
                });
            }
        }
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    toggleModalImport = () => {
        this.setState({
            isOpenImport: !this.state.isOpenImport
        });
    };

    updateCalendars = (calendars) => {
        this.setState({
            calendars: calendars
        });
    }

    completeImport = (calendarsId) => {
        this.props.importCalendars(calendarsId).then(() => {
            this.setState({
                calendars: this.props.calendars.data
            });
            this.toggleModalImport()
        });
    };

    changeShow = (e, calendar) => {
        e.stopPropagation();
        calendar.show = !calendar.show;
        this.props.updateCalendar(calendar.id, calendar).then(() => {
            this.setState({
                calendars: this.props.calendars.data
            })
        });
    }

    complete = (calendar) => {
        if (calendar.id) {
            this.props.updateCalendar(calendar.id, calendar).then(() => {
                this.setState({
                    calendars: this.props.calendars.data,
                    isOpen: !this.state.isOpen
                })
            });
            return;
        }
        this.props.addCalendar(calendar).then(() => {
            this.setState({
                calendars: this.props.calendars.data,
                isOpen: !this.state.isOpen
            })
        });
    };


    render() {
        return (
            <div className={'calendars'}>
                <ControlPanel
                    toggleModal={this.toggleModal}
                    toggleModalImport={this.toggleModalImport}/>
                <Calendars
                    calendars={this.state.calendars}
                    toggleModal={this.toggleModal}
                    changeShow={this.changeShow}/>
                <Calendar
                    show={this.state.isOpen}
                    onCancel={this.toggleModal}
                    onOk={this.complete}
                    calendar={this.state.calendar}
                    updateCalendars={this.updateCalendars}/>
                <Import
                    show={this.state.isOpenImport}
                    onCancel={this.toggleModalImport}
                    onOk={this.completeImport}
                    updateCalendars={this.updateCalendars}/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        calendars: state.calendars
    }
};

const mapDispatchToProps = dispatch => {
    return {
        loadCalendars: () => dispatch(calendars.loadCalendars()),
        importCalendars: (calendarsId) => dispatch(calendars.importCalendars(calendarsId)),
        updateCalendar: (id, obj) => dispatch(calendars.updateCalendar(id, obj)),
        addCalendar: (obj) => dispatch(calendars.addCalendar(obj)),
    }
};

CalendarsList.propTypes = {
    calendars: PropTypes.any,
    changeShow: PropTypes.func,
    changeCalendars: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarsList);