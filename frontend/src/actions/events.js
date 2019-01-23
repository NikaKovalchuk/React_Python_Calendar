export const addEvent = (body) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let {token} = getState().auth;
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        body.start_date = new Date(body.start_date).toISOString()
        body.finish_date = new Date(body.finish_date).toISOString()

        body = JSON.stringify(body)
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
    return (dispatch, getState) => {
        body.start_date = new Date(body.start_date).toISOString()
        body.finish_date = new Date(body.finish_date).toISOString()

        body = JSON.stringify(body)
        let headers = {"Content-Type": "application/json"};
        let {token} = getState().auth;
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        return fetch("http://localhost:8000/api/event/" + index + "/", {headers, method: "PUT", body})
            .then(res => res.json())
            .then(events => {
                return dispatch({
                    type: 'UPDATE_EVENT',
                    events
                })
            })
    }
}

export const deleteEvent = (id) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let {token} = getState().auth;
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        return fetch("http://localhost:8000/api/event/" + id + "/", {headers, method: "DELETE",})
            .then(res => {
                return dispatch({
                    type: 'DELETE_EVENT'
                })
            })
    }
}

export const loadEvent = (id) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let {token} = getState().auth;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        return fetch("http://localhost:8000/api/event/" + id, {headers, method: "GET",})
            .then(res => {
                if (res.status === 500 || res.status === 404) {
                    return dispatch({type: 'EVENT_ERROR'})
                } else {
                    return res.json()
                }
            })
            .then(event => {
                return dispatch({
                    type: 'LOAD_EVENT',
                    event
                })
            })
    }
}

export const loadEvents = (startDate, finishDate) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let {token} = getState().auth;

        startDate = new Date(startDate).toISOString()
        finishDate = new Date(finishDate).toISOString()

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        return fetch("http://localhost:8000/api/event/?startDate=" + startDate + "&finishDate=" + finishDate, {
            headers,
            method: "GET",
        })
            .then(res => res.json())
            .then(events => {
                return dispatch({
                    type: 'LOAD_EVENTS',
                    events
                })
            })
    }
}