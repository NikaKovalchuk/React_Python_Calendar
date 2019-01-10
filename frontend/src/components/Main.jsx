import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";
import DynamicForm from "./DynamicForm";
import ReactCalendar from "rc-calendar";

class Settings extends Component {
    state = {
        user: {},
    }

    componentDidMount() {
        this.props.loadUser().then(response => {
            this.setState({
                user: this.props.auth.user
            });
        });
    }

    onSubmit = (model) => {
        this.props.changePassword(model);
    }

    render() {
        return (
            <div>
                <div className={'side-bar'}>
                    <ReactCalendar/>
                </div>
                <div className={'scheduler'}>  </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        auth: state.auth,
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);