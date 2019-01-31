import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";
import Calendar from "./Calendar"
import CalendarsList from "./CalendarsList"
import Schedule from "./Schedule"
import "../css/main.css"

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            calendars: {},
            date: new Date(new Date().setHours(0, 0, 0,)),
            selectedDate: new Date(new Date().setHours(0, 0, 0)),
        };
    };

    componentDidMount() {
        this.props.loadUser().then(response => {
            this.setState({user: this.props.auth.user});
        });
    };

    changeDate = (date) => {
        this.setState({selectedDate: date});
    };

    changeCalendars = (calendars) => {
        this.setState({calendars: calendars});
    };

    render() {
        return (
            <div className={"main-content"}>
                <div className={'side-bar'}>
                    <Calendar currentDate={this.state.date} selectedDate={this.state.selectedDate}
                              changeDate={this.changeDate}/>
                    <CalendarsList calendars={this.state.calendars} changeCalendars={this.changeCalendars} />
                </div>
                <div className={'scheduler'}>
                    <Schedule currentDate={this.state.date} selectedDate={this.state.selectedDate}
                              calendars={this.state.calendars} changeDate={this.changeDate}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        events: state.events,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => {
            return dispatch(auth.loadUser());
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);