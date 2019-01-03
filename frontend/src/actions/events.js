export const addEvent = (body) => {
    return dispatch => {
        let headers = {"Content-Type": "application/json"};
        body = JSON.stringify(body)
        console.log(body)
        return fetch("http://localhost:8000/api/event/", {headers, method: "POST", body})
            .then(res => res.json())
            .then(event => {
                return dispatch({
                    type: 'ADD_EVENT',
                    event
                })
            })
    }
}

export const updateEvent = (index, body) => {
    return (dispatch, getState) => {

        let headers = {"Content-Type": "application/json"};

        return fetch("http://localhost:8000/api/event/${index}/", {headers, method: "PUT", body})
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
    return dispatch => {
        let headers = {"Content-Type": "application/json"};
        return fetch("http://localhost:8000/api/event/"+ id , {headers, method: "DELETE",})
            .then(res => res.json())
            .then(events => {
                return dispatch({
                    type: 'DELETE_EVENT',
                    id
                })
            })
    }
}

export const fetchEvents = () => {
    return dispatch => {
        let headers = {"Content-Type": "application/json"};
        return fetch("http://localhost:8000/api/event/", {headers,})
            .then(res => res.json())
            .then(events => {
                return dispatch({
                    type: 'FETCH_EVENTS',
                    events
                })
            })
    }
}

export const loadEvent = id => {
    return dispatch => {
        let headers = {"Content-Type": "application/json"};
        return fetch("http://localhost:8000/api/event/" + id , {headers,  method: "GET",})
            .then(res => res.json())
            .then(events => {
                return dispatch({
                    type: 'LOAD_EVENT',
                    events
                })
            })
    }
}