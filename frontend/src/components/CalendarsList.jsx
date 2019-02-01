import React from "react";
import '../css/calendars.css'
import {calendars} from "../actions";
import {connect} from "react-redux";
import Calendar from "./modals/Calendar";
import Import from "./modals/Import";

class ControlPanel extends React.Component {
    render() {
        return (
            <div>
                <div className=" btn-group wide btn-group-toggle btn-group-center" data-toggle="buttons">
                    <button type="button" className="btn wide btn-secondary btn-sm"
                            onClick={() => this.props.toggleModal()}>Add calendar
                    </button>
                    <button type="button" className="btn wide btn-secondary btn-sm"
                            onClick={() => this.props.toggleModalImport()}>Import calendar
                    </button>
                </div>
            </div>
        )
    }
}

class Calendars extends React.Component {
    render() {
        let result = []
        let calendars = this.props.calendars

        for (let index = 0; index < calendars.length; index++) {
            let calendar = calendars[index]
            let colorStyle = {
                backgroundColor: calendar.color
            };
            result.push(<div className={"element"} key={calendar.id} onClick={() => this.props.toggleModal(calendar)}>
                <div className={"name"}>{calendar.name}</div>
                <div className={"control-panel"}>
                    <div className={"show"} onClick={(e) => this.props.changeShow(e, calendar)}>
                        <input type="checkbox" checked={calendar.show} onChange={() => {}}></input>
                    </div>
                    <div className={"color"} style={colorStyle}></div>
                </div>
            </div>)
        }

        return <div className={'calendars-list'}>{result}</div>
    }

}

class CalendarsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            calendars: this.props.calendars,
            isOpen: false,
            isOpenImport: false,
            calendar: {},
            accessOptions: [{0: 'Public'}, {1: 'Private'}],
        }
    }

    componentDidMount() {
        this.loadCalendars()
    }

    loadCalendars() {
        this.props.loadCalendars().then(response => {
            this.setState({calendars: this.props.calendars});
            this.props.changeCalendars(this.props.calendars)
        });
    }

    toggleModal = (calendar) => {
        if (this.state.isOpen === true) {
            this.loadCalendars()
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

    completeImport = (calendarsId) => {
        this.props.importCalendars(calendarsId).then(response => {
            this.toggleModalImport()
            this.loadCalendars()
        });
    };

    changeShow = (e, calendar)=> {
        e.stopPropagation();
        calendar.show = !calendar.show
        this.props.updateCalendar(calendar.id, calendar).then(response => {
            this.loadCalendars()
        });
    }

    complete = (calendar) => {
        if (calendar.id) {
            this.props.updateCalendar(calendar.id, calendar).then(response => {
                this.toggleModal()
            });
        } else {
            this.props.addCalendar(calendar).then(response => {
                this.toggleModal()
            });
        }
    };


    render() {
        return (
            <div className={'calendars'}>
                <ControlPanel toggleModal={this.toggleModal} toggleModalImport={this.toggleModalImport}/>

                <Calendars calendars={this.state.calendars} toggleModal={this.toggleModal} changeShow={this.changeShow} />

                <Calendar show={this.state.isOpen} onCancel={this.toggleModal} onOk={this.complete}
                          calendar={this.state.calendar}></Calendar>


                <Import show={this.state.isOpenImport} onCancel={this.toggleModalImport}
                        onOk={this.completeImport}></Import>

            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        events: state.events,
        auth: state.auth,
        calendars: state.calendars
    }
};

const mapDispatchToProps = dispatch => {
    return {
        loadCalendars: () => {
            return dispatch(calendars.loadCalendars());
        },
        importCalendars: (calendarsId) => {
            return dispatch(calendars.importCalendars(calendarsId));
        },
        updateCalendar: (id, obj) => {
            return dispatch(calendars.updateCalendar(id, obj));
        },
        addCalendar: (obj) => {
            return dispatch(calendars.addCalendar(obj));
        },

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarsList);