import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";
import DynamicForm from "./DynamicForm";

class Settings extends Component {
    state = {
        user: {},
    }

    componentDidMount(){
        this.props.loadUser().then(response => {
          this.setState({
            user : this.props.auth.user
          });
        });
    }

    onSubmit = (model) => {
        this.props.changePassword(model);
    }

    render() {
        return (
            <div>
                <div>
                    <h1>Account</h1>
                    <p className={"form-label"}>Email : {this.state.user.email}</p>
                </div>
                <div>
                    <DynamicForm className="form"
                     title = "Change password"
                     data = {this.state.user}
                     model = {[
                        {key: "oldpassword", label: "Old Password", type: "password", props:{required: true}},
                        {key: "password1", label: "Password", type: "password", props:{required: true}},
                        {key: "password2", label: "Password Again", type: "password", props:{required: true}},
                     ]}
                     onSubmit = {(model) => this.onSubmit(model)}
                 />
                </div>
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