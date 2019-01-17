import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";
import Calendar from "./Calendar"
import Scheduler from "./Scheduler"

class Settings extends Component {
    state = {
        user: {},
        events: {},
        date: new Date(),
        selectedDate: new Date()
    }

    changeDate = (date) => {
       this.setState(state => ({ selectedDate: date }));
    };

    componentDidMount() {
        this.props.loadUser().then(response => {
            this.setState({
                user: this.props.auth.user
            });
        });
    }

    render() {
        return (
            <div className={"main-content"}>
                <div className={'side-bar'}>
                    <div className={'calendar'}>
                        <Calendar currentDate={this.state.date} selectedDate={this.state.selectedDate} changeDate={this.changeDate}/>
                    </div>
                </div>
                <div className={'scheduler'}>
                    <Scheduler currentDate={this.state.date} selectedDate={this.state.selectedDate} changeDate={this.changeDate}/>
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
}

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => {
            return dispatch(auth.loadUser());
        },
        changePassword: (model) => {
            return dispatch(auth.changePassword(model));
        },
        loadEvents: () => {
            return dispatch(events.loadEvents());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);