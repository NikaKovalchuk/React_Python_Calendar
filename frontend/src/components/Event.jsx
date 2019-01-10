import React, {Component} from 'react';
import {connect} from 'react-redux';
import {events} from "../actions";
import {Redirect} from "react-router-dom";


class Events extends Component {
    state = {
        id: this.props.match.params.id,
        event: {},
        edit: false,
        not_found: false,
    }

    componentDidMount() {
        this.props.loadEvent(this.state.id).then(response => {
            if (this.props.events[0]) {
                this.setState({
                    event: this.props.events[0]
                });
            } else {
                this.setState({
                    not_found: true
                });
            }
        });
    }

    edit() {
        this.setState({
            edit: true
        })
    }

    renderRedirect = () => {
        if (this.state.edit) {
            return <Redirect to={`/event/edit/${this.state.id}`}/>
        }
        if (this.state.not_found) {
            return <Redirect to={`/not_found`}/>
        }
    }

    render() {
        return (
            <div>
                {this.renderRedirect()}
                <div>
                    <p className={'title'}>{this.state.event.title}</p>
                    <button onClick={() => this.edit()} className="btn btn-secondary">EDIT</button>
                    <button onClick={() => this.props.deleteEvent(this.state.id)} className="btn btn-danger">DELETE
                    </button>
                </div>
                <p className={'data'}>Text : {this.state.event.text}</p>
                <p className={'data'}>Status : {this.state.event.status}</p>
                <p className={'data'}>Start Date : {this.state.event.start_date}</p>
                <p className={'data'}>Finish Date : {this.state.event.finish_date}</p>
                <p className={'data'}>Cycle : {this.state.event.cycle}</p>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        events: state.events,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addEvent: (text) => {
            return dispatch(events.addEvent(text));
        },
        updateEvent: (id, text) => {
            return dispatch(events.updateEvent(id, text));
        },
        deleteEvent: (id) => {
            dispatch(events.deleteEvent(id));
        },
        loadEvent: (id) => {
            return dispatch(events.loadEvent(id));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Events);