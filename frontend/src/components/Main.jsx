import React, {Component} from 'react';
import Schedule from "./schedule"
import {connect} from 'react-redux';
import "../css/main.css"
import SideBar from "./SideBar";

class Main extends Component {
    state = {
        calendars: [],
    };

    changeCalendars = (calendars) => this.setState({calendars: calendars});

    render() {
        return (
            <div className={"main-content"}>
                <SideBar
                    calendars={this.state.calendars}
                    changeCalendars={this.changeCalendars} />
                <Schedule
                    calendars={this.state.calendars}/>
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