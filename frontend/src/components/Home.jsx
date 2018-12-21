import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";


class Events extends Component {
    state = {
        text: "",
        updateEventId: null,
    }

    componentDidMount() {
        this.props.fetchEvents();
    }

    resetForm = () => {
        this.setState({text: "", updateEventId: null});
    }

    selectForEdit = (id) => {
        let event = this.props.events[id];
        this.setState({text: event.title, updateEventId: id});
    }

    submitNote = (e) => {
        e.preventDefault();
        if (this.state.updateEventId === null) {
            this.props.addEvent(this.state.text);
        } else {
            this.props.updateEvent(this.state.updateEventId, this.state.text).then(this.resetForm);
        }
        this.props.addEvent(this.state.text).then(this.resetForm)
    }

    render() {
        return (
            <div>
                <h2>Welcome to PonyNote!</h2>
                <div style={{textAlign: "right"}}>
                     (<a onClick={this.props.logout}>logout</a>)
                </div>
                <hr/>

                <h3>Add new note</h3>
                <form onSubmit={this.submitNote}>
                    <input
                        value={this.state.text}
                        placeholder="Enter event here..."
                        onChange={(e) => this.setState({text: e.target.value})}
                        required/>
                    <button onClick={this.resetForm}>Reset</button>
                    <input type="submit" value="Save Event"/>
                </form>

                <h3>Events</h3>
                <table>
                    <tbody>
                    {this.props.events.map((event, id) => (
                        <tr key={`event_${id}`}>
                            <td>{event.title}</td>
                            <td>
                                <button onClick={() => this.selectForEdit(id)}>edit</button>
                            </td>
                            <td>
                                <button onClick={() => this.props.deleteEvent(id)}>delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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
        addEvent: (text) => {
            return dispatch(events.addEvent(text));
        },
        updateEvent: (id, text) => {
            return dispatch(events.updateEvent(id, text));
        },
        deleteEvent: (id) => {
            dispatch(events.deleteEvent(id));
        },
        fetchEvents: () => {
            dispatch(events.fetchEvents());
        },
        logout: () => dispatch(auth.logout()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Events);