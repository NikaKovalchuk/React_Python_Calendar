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
        main: false,
        CycleOptions: ['No','Day','Week','Month', 'Year'], // заменить на enum
    }

    componentWillMount() {
        this.props.loadEvent(this.state.id).then(response => {
            if (this.props.events[0]) {
                this.setState({
                    event: this.props.events[0]
                });
            }
            else {
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

    delete() {
        this.props.deleteEvent(this.state.id)
        this.setState({
            main: true
        })
    }


    renderRedirect = () => {
        if (this.state.edit) {
            return <Redirect to={`/event/edit/${this.state.id}`}/>
        }
        if (this.state.not_found) {
            return <Redirect to={`/not_found`}/>
        }
        if (this.state.main) {
            return <Redirect to='/'/>
        }
    }

    render() {
        return (
            <div>
                {this.renderRedirect()}
                <div>
                    <p className={'title'}>{this.state.event.title}</p>
                </div>
                    <button onClick={() => this.edit()} className="btn btn-secondary">EDIT</button>
                    <button onClick={() => this.delete()} className="btn btn-danger">DELETE</button>
                <div className={'margin-top'}>
                    <p className={'data'}>Text : {this.state.event.text}</p>
                    <p className={'data'}>Start Date : {new Date(this.state.event.start_date).toDateString()} {new Date(this.state.event.start_date).toLocaleTimeString("en-US")}</p>
                    <p className={'data'}>Finish Date : {new Date(this.state.event.finish_date).toDateString()} {new Date(this.state.event.finish_date).toLocaleTimeString("en-US")}</p>
                    <p className={'data'}>Repear : {this.state.CycleOptions[this.state.event.cycle]}</p>
                </div>
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