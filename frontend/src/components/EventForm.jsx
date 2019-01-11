import React, {Component} from 'react';
import {connect} from 'react-redux';
import {events} from "../actions";
import DynamicForm from "./DynamicForm"
import {Redirect} from 'react-router-dom';

class EventForm extends Component {
    state = {
        text: "",
        title: "",
        start_date: new Date(),
        finish_date: new Date(),
        id: this.props.match.params.id || null,
        price: 0,
        event: {},
        redirect: false,
        route: '',
    }

    componentDidMount() {
        if (this.state.id !== null) {
            this.props.loadEvent(this.state.id).then(response => {
                this.setState({
                    event: this.props.events[0]
                });
            });
        } else {
            this.setState({
                event: {
                    start_date: this.start_date,
                    finish_date: this.finish_date,
                }
            });
        }
    }

    onSubmit = (model) => {
        if (this.state.id === null) {
            this.props.addEvent(model).then(response => {
                this.setState({
                    redirect: true
                })
            });
        } else {
            this.props.updateEvent(this.state.id, model).then(response => {
                this.setState({
                    redirect: true
                })
            });
        }
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/'/>
        }
    }

    render() {
        return (
            <div>
                {this.renderRedirect()}
                <DynamicForm className="form"
                             title="Event Form"
                             data={this.state.event}
                             model={[
                                 {key: "title", label: "Title", props: {required: true}},
                                 {key: "text", label: "Text", props: {required: true}},
                                 {
                                     key: "start_date",
                                     label: "Start time",
                                     type: "datetime-local",
                                     props: {required: true}
                                 },
                                 {
                                     key: "finish_date",
                                     label: "Finish time",
                                     type: "datetime-local",
                                     props: {required: true}
                                 },
                             ]}
                             onSubmit={(model) => this.onSubmit(model)}
                />
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        events: state.events,
        user: state.auth.user,
    }
}


const mapDispatchToProps = dispatch => {
    return {
        addEvent: (model) => {
            return dispatch(events.addEvent(model));
        },
        updateEvent: (id, model) => {
            return dispatch(events.updateEvent(id, model));
        },
        deleteEvent: (id) => {
            dispatch(events.deleteEvent(id));
        },
        loadEvent: (id) => {
            return dispatch(events.loadEvent(id));
        },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(EventForm);