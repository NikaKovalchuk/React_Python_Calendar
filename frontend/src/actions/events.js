export const addEvent = (body) => {
    return dispatch => {
        let headers = {"Content-Type": "application/json"};
        let isCreated = true;
        body = JSON.stringify(body)
        console.log(body)
        return fetch("http://localhost:8000/api/event/", {headers, method: "POST", body})
            .then(res => res.json())
            .then(events => {
                return dispatch({
                    type: 'ADD_EVENT'
                })
            })
    }
}

export const updateEvent = (index, body) => {
    return dispatch => {
        body = JSON.stringify(body)
        let headers = {"Content-Type": "application/json"};
        return fetch("http://localhost:8000/api/event/" + index + "/", {headers, method: "PUT", body})
            .then(res => res.json())
            .then(events => {
                return dispatch({
                    type: 'UPDATE_EVENT'
                })
            })
    }
}

export const deleteEvent = id => {
    return dispatch => {
        let headers = {"Content-Type": "application/json"};
        return fetch("http://localhost:8000/api/event/" + id + "/", {headers, method: "DELETE",})
            .then(res => res.json())
            .then(events => {
                return dispatch({
                    type: 'DELETE_EVENT',
                    events
                })
            })
    }
}

export const loadEvent = id => {
    return dispatch => {
        let headers = {"Content-Type": "application/json"};
        return fetch("http://localhost:8000/api/event/" + id, {headers, method: "GET",})
            .then(res => res.json())
            .then(events => {
                return dispatch({
                    type: 'LOAD_EVENT',
                    events
                })
            })
    }
}