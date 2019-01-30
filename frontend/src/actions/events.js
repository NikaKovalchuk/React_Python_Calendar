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

export const loadNotifications = (startDate, finishDate) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let {token} = getState().auth;
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        startDate = new Date(startDate).toISOString()
        finishDate = new Date(finishDate).toISOString()

        return fetch("http://localhost:8000/api/event/?notification=true&startDate=" + startDate + "&finishDate=" + finishDate, {
            headers,
            method: "GET",
        })
            .then(res => res.json())
            .then(events => {
                return dispatch({
                    type: 'LOAD_NOTIFICATIONS',
                    events
                })
            })
    }
}

export const loadEvents = (startDate, finishDate, calendars) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let {token} = getState().auth;
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        startDate = new Date(startDate).toISOString()
        finishDate = new Date(finishDate).toISOString()

        return fetch("http://localhost:8000/api/event/?startDate=" + startDate + "&finishDate=" + finishDate + "&calendar=" + calendars, {
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

export const addCalendar = (body) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let {token} = getState().auth;
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        body = JSON.stringify(body)

        return fetch("http://localhost:8000/api/event/calendar/", {headers, method: "POST", body})
            .then(res => res.json())
            .then(calendar => {
                return dispatch({
                    type: 'ADD_CALENDAR'
                })
            })
    }
}

export const loadCalendars = (importCalendar=false) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let {token} = getState().auth;
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        let params = ""
        if (importCalendar == true ){
            params = "?import=true"
        }

        return fetch("http://localhost:8000/api/event/calendar/" + params, {
            headers,
            method: "GET",
        })
            .then(res => res.json())
            .then(calendars => {
                return dispatch({
                    type: 'LOAD_CALENDARS',
                    calendars
                })
            })
    }
}

export const updateCalendar = (index, calendar) => {
    return (dispatch, getState) => {
        let body = JSON.stringify(calendar)
        let headers = {"Content-Type": "application/json"};
        let {token} = getState().auth;
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        return fetch("http://localhost:8000/api/event/calendar/" + index + "/", {headers, method: "PUT", body})
            .then(res => res.json())
            .then(calendar => {
                return dispatch({
                    type: 'UPDATE_CALENDAR',
                    calendar
                })
            })
    }
}

export const deleteCalendar = (id) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let {token} = getState().auth;
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        return fetch("http://localhost:8000/api/event/calendar/" + id + "/", {headers, method: "DELETE",})
            .then(res => {
                return dispatch({
                    type: 'DELETE_CALENDAR'
                })
            })
    }
}

export const importCalendars = (calendarsId) => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};
        let {token} = getState().auth;
        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        let params = "?id=" + calendarsId

        return fetch("http://localhost:8000/api/event/calendar/import/" + params, {headers, method: "GET",})
            .then(res => {
                return dispatch({
                    type: 'IMPORT_CALENDAR'
                })
            })
    }
}

