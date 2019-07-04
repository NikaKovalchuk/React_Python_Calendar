import React, {Component} from 'react';
import Schedule from "./schedule"
import {connect} from 'react-redux';
import "../css/main.css"
import SideBar from "./SideBar";

class Main extends Component {
    state = {
        calendars: [],
        selectedDate: new Date(new Date().setHours(0, 0, 0)),
    };

    changeDate = (date) => this.setState({selectedDate: date});
    changeCalendars = (calendars) => this.setState({calendars: calendars});

    render() {
        return (
            <div className={"main-content"}>
                <SideBar
                    calendars={this.state.calendars}
                    changeCalendars={this.changeCalendars}
                    selectedDate={this.state.selectedDate}
                    changeDate={this.changeDate} />
                <Schedule
                    selectedDate={this.state.selectedDate}
                    calendars={this.state.calendars}
                    changeDate={this.changeDate} />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        events: state.events
    }
};

export default connect(mapStateToProps, null)(Main);