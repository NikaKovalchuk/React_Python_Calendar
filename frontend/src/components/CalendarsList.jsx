import React from "react";
import '../css/calendars.css'
import {auth, events} from "../actions";
import {connect} from "react-redux";
import Calendar from "./modals/Calendar";
import Import from "./modals/Import";

class CalendarsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            calendars: this.props.calendars,
            isOpen: false,
            isOpenImport: false,
            calendar: {},
            accessOptions: [{0: 'Public'}, {1: 'Private'}],
        }
    }

    componentDidMount() {
        this.props.loadUser().then(response => {
            this.setState({user: this.props.auth.user});
        })
        this.loadCalendars()
    }

    loadCalendars() {
        this.props.loadCalendars().then(response => {
            this.setState({calendars: this.props.events});
            this.props.changeCalendars(this.props.events)
        });
    }

    toggleModal = (calendar) => {
        if (this.state.isOpen == true) {
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

    changeShow(e, calendar) {
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

    list() {
        let result = []
        let calendars = this.state.calendars

        for (let index = 0; index < this.state.calendars.length; index++) {
            let calendar = calendars[index]
            let colorStyle = {
                backgroundColor: calendar.color
            };
            result.push(<div className={"element"} key={calendar.id} onClick={() => this.toggleModal(calendar)}>
                <div className={"name"}>{calendar.name}</div>
                <div className={"control-panel"}>
                    <div className={"show"} onClick={(e) => this.changeShow(e, calendar)}>
                        <input type="checkbox" checked={calendar.show} onChange={() => {
                        }}></input>
                    </div>
                    <div className={"color"} style={colorStyle}></div>
                </div>
            </div>)
        }

        return <div className={'calendars-list'}>{result}</div>
    }

    buttons() {
        return (
            <div>
                <div className=" btn-group wide btn-group-toggle btn-group-center" data-toggle="buttons">
                    <button type="button" className="btn wide btn-secondary btn-sm"
                            onClick={() => this.toggleModal()}>Add calendar
                    </button>
                    <button type="button" className="btn wide btn-secondary btn-sm"
                            onClick={() => this.toggleModalImport()}>Import calendar
                    </button>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div className={'calendars'}>
                {this.buttons()}
                {this.list()}

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
    }
};

const mapDispatchToProps = dispatch => {
    return {
        loadCalendars: () => {
            return dispatch(events.loadCalendars());
        },
        importCalendars: (calendarsId) => {
            return dispatch(events.importCalendars(calendarsId));
        },
        updateCalendar: (id, calendar) => {
            return dispatch(events.updateCalendar(id, calendar));
        },
        addCalendar: (calendar) => {
            return dispatch(events.addCalendar(calendar));
        },

        loadUser: () => {
            return dispatch(auth.loadUser());
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarsList);