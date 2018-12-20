export const addEvent = text => {
    return dispatch => {
        let headers = {"Content-Type": "application/json"};
        let body = JSON.stringify({text,});
        return fetch("/api/event/", {headers, method: "POST", body})
            .then(res => res.json())
            .then(event => {
                return dispatch({
                    type: 'ADD_EVENT',
                    event
                })
            })
    }
}

export const updateEvent = (index, text) => {
    return (dispatch, getState) => {

        let headers = {"Content-Type": "application/json"};
        let body = JSON.stringify({text,});
        let eventId = getState().events[index].id;

        return fetch(`/api/event/${eventId}/`, {headers, method: "PUT", body})
            .then(res => res.json())
            .then(event => {
                return dispatch({
                    type: 'UPDATE_EVENT',
                    event,
                    index
                })
            })
    }
}

export const deleteEvent = id => {
    return {
        type: 'DELETE_EVENT',
        id
    }
}

export const fetchEvents = () => {
    return dispatch => {
        let headers = {"Content-Type": "application/json"};
        return fetch("/api/event/", {headers,})
            .then(res => res.json())
            .then(events => {
                return dispatch({
                    type: 'FETCH_EVENTS',
                    events
                })
            })
    }
}