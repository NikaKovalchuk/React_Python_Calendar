import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";

class Settings extends Component {
    state = {
        user: {},
        password: "",
        password1: "",
        password2: "",
    }

    componentDidMount() {
        this.props.loadUser().then(response => {
            this.setState({
                user: this.props.auth.user
            });
        });
    }

    export = () => {
        this.props.export();
    }

    import = () => {
        this.props.import();
    }

    render() {
        return (
            <div>
                <div>
                    <div className={'inline-block'}><h3>Export your calendar : </h3></div>
                    <div className={'inline-block'}>
                        <button onClick={this.export} className="btn btn-secondary export-button"> Export</button>
                    </div>
                </div>
                <div>
                    <div className={'inline-block'}><h3>Import calendar : </h3></div>
                    <div className={'inline-block'}>
                        <button onClick={this.import} className="btn btn-secondary export-button"> Import</button>
                    </div>
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
        export: () => {
            return dispatch(events.exportEvents());
        },
        import: () => {
            return dispatch(events.importEvents());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);