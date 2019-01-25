import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";
import Calendar from "./Calendar"
import Schedule from "./Schedule"
import "../css/main.css"

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            events: {},
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

    render() {
        return (
            <div className={"main-content"}>
                <div className={'side-bar'}>
                    <div className={'calendar'}>
                        <Calendar currentDate={this.state.date} selectedDate={this.state.selectedDate}
                                  changeDate={this.changeDate}/>
                    </div>
                </div>
                <div className={'scheduler'}>
                    <Schedule currentDate={this.state.date} selectedDate={this.state.selectedDate}
                              changeDate={this.changeDate}/>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);