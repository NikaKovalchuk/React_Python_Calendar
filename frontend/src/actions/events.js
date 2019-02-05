const API_BASE = 'http://localhost:8000/api/';
const API_ENDPOINT_TYPE = 'event/'
const API_URL = API_BASE + API_ENDPOINT_TYPE

const API_ENDPOINTS = {
    ADD_EVENT: API_URL,
    LOAD_EVENTS: API_URL,
    UPDATE_EVENT: API_URL,
    DELETE_EVENT: API_URL,
    LOAD_NOTIFICATIONS: API_URL,
}

const post = (url, body, dispatch, getState, convertDate = false) => {
    let headers = {"Content-Type": "application/json"};
    if (convertDate) {
        body.start_date = new Date(body.start_date).toISOString()
        body.finish_date = new Date(body.finish_date).toISOString()
    }
    body = JSON.stringify(body)
    let {token} = getState().auth;
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }

    return fetch(url, {headers, body, method: 'POST'}).then(res => {
        if (res.status === 500) {
            dispatch({type: 'SERVER_ERROR', data: res.data});
            return res.data;
        }
        return res.json().then(data => {
            return {status: res.status, data};
        })
    })
}

const get = (url, dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let {token} = getState().auth;
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }
    return fetch(url, {headers, method: 'GET'}).then(res => {
        if (res.status === 500) {
            dispatch({type: 'SERVER_ERROR', data: res.data});
            return res.data;
        }
        return res.json().then(data => {
            return {status: res.status, data};
        })
    })
}

const put = (url, body, dispatch, getState, convertDate = false) => {
    let headers = {"Content-Type": "application/json"};
    if (convertDate) {
        body.start_date = new Date(body.start_date).toISOString()
        body.finish_date = new Date(body.finish_date).toISOString()
    }
    body = JSON.stringify(body)
    let {token} = getState().auth;
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }
    return fetch(url, {headers, body, method: 'PUT'}).then(res => {
        if (res.status === 500) {
            dispatch({type: 'SERVER_ERROR', data: res.data});
            return res.data;
        }
        return res.json().then(data => {
            return {status: res.status, data};
        })
    })
}

const del = (url, dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    let {token} = getState().auth;
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }
    return fetch(url, {headers, method: 'DELETE'}).then(res => {
        if (res.status === 500) {
            dispatch({type: 'SERVER_ERROR', data: res.data});
            return res.data;
        }
        return res.json().then(data => {
            return {status: res.status, data};
        })
    })
}

export const addEvent = (body) => (dispatch, getState) => post(API_ENDPOINTS.ADD_EVENT, body, dispatch, getState, true).then(res => {
    if (res.status === 200) {
        dispatch({type: 'ADD_EVENT', data: res.data});
        return res.data;
    }
})


export const updateEvent = (index, body) => (dispatch, getState) => {
    let params = index + "/"
    return put(API_ENDPOINTS.UPDATE_EVENT + params, body, dispatch, getState).then(res => {
        if (res.status === 200) {
            dispatch({type: 'UPDATE_EVENT', data: res.data});
            return res.data;
        } else {
            dispatch({type: 'EVENT_ERROR', data: res.data});
            return res.data;
        }
    })
}


export const deleteEvent = (id) => (dispatch, getState) => {
    let params = id + "/"
    return del(API_ENDPOINTS.DELETE_EVENT + params, dispatch, getState).then(res => {
        if (res.status === 200) {
            dispatch({type: 'DELETE_EVENT', data: res.data});
            return res.data;
        } else {
            dispatch({type: 'EVENT_ERROR', data: res.data});
            return res.data;
        }
    })
}

export const loadEvents = (startDate, finishDate, calendars) => (dispatch, getState) => {
    startDate = new Date(startDate).toISOString()
    finishDate = new Date(finishDate).toISOString()
    let params = "?startDate=" + startDate + "&finishDate=" + finishDate + "&calendar=" + calendars
    return get(API_ENDPOINTS.LOAD_EVENTS + params, dispatch, getState).then(res => {
        if (res.status === 200) {
            dispatch({type: 'LOAD_EVENTS', data: res.data});
            return res.data;
        } else {
            dispatch({type: 'EVENT_ERROR', data: res.data});
            return res.data;
        }

    })
}


export const loadNotifications = (startDate, finishDate, calendars) => (dispatch, getState) => {
    startDate = new Date(startDate).toISOString()
    finishDate = new Date(finishDate).toISOString()
    let params = "?notification=true&startDate=" + startDate + "&finishDate=" + finishDate + "&calendar=" + calendars
    return get(API_ENDPOINTS.LOAD_NOTIFICATIONS + params, dispatch, getState).then(res => {
        if (res.status === 200) {
            dispatch({type: 'LOAD_NOTIFICATIONS', data: res.data});
            return res.data;
        } else {
            dispatch({type: 'NOTIFICATION_ERROR', data: res.data});
            return res.data;
        }

    })
}
