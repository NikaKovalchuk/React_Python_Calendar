import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";


class Account extends Component {
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

    edit(){
    }

    render() {
        return (
            <div>
                <h3>note</h3>
                <h3>Account</h3>
                <p>{this.state.user.username}</p>
                <p>{this.state.user.first_name}</p>
                <p>{this.state.user.last_name}</p>
                <p>{this.state.user.email}</p>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);