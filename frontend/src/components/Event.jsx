import React, {Component} from 'react';
import {connect} from 'react-redux';
import {auth, events} from "../actions";


class Events extends Component {
    state = {
        id: this.props.match.params.id,
        event: {},
    }

    componentDidMount(){
        this.props.loadEvent(this.state.id).then(response => {
          this.setState({
            event : this.props.events[0]
          });
        });
    }

    edit(){
    }

    render() {
        return (
            <div>
                <h3>note</h3>
                <h3>Event</h3>
                    <h5>{this.state.event.title}</h5>
                    <p>{this.state.event.text}</p>
                    <p>{this.state.event.status}</p>
                    <p>{this.state.event.price}</p>
                    <p>{this.state.event.start_date}</p>
                    <p>{this.state.event.finish_date}</p>
                    <div>
                        <button onClick={() => this.edit(this.state.id)}>edit</button>
                    </div>
                    <div>
                        <button onClick={() => this.props.deleteEvent(this.state.id)}>delete</button>
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