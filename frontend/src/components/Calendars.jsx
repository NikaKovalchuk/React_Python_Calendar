import React from "react";
import '../css/calendars.css'
import {auth, events} from "../actions";
import {connect} from "react-redux";

class Calendars extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            calendars: this.props.calendars,
        }
    }

    componentDidMount() {
        this.props.loadUser().then(response => {
            this.setState({user: this.props.auth.user});
        })
        this.loadCalendars()
    }

    loadCalendars() {
        this.props.loadCalendars(this.state.user.id).then(response => {
            this.setState({calendars: this.props.events});
            this.props.changeCalendars(this.props.events)
        });
    }

    changeShow (calendar){
        calendar.show = !calendar.show
        this.props.updateCalendar(calendar.id, calendar).then(response => {
            this.loadCalendars()
        });
    }

    list() {
        let result = []
        let calendars = this.state.calendars

        for (let index = 0; index < this.state.calendars.length; index++) {
            let calendar = calendars[index]
            let colorStyle = {
                backgroundColor: calendar.color
            };
            result.push(<div className={"element"} key={calendar.id}>
                <div className={"name"}>{calendar.name}</div>
                <div className={"control-panel"}>
                    <div className={"show"}>
                        <input type="checkbox" checked={calendar.show} onChange={() => this.changeShow(calendar)}></input>
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
                <div className="wide btn-group btn-group-toggle" data-toggle="buttons">
                    <button type="button" className="btn wide btn-secondary btn-sm">Add calendar
                    </button>
                    <button type="button" className="btn wide btn-secondary btn-sm">Import calendar
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
        updateCalendar: (id, calendar) => {
            return dispatch(events.updateCalendar(id, calendar));
        },
        loadUser: () => {
            return dispatch(auth.loadUser());
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendars);