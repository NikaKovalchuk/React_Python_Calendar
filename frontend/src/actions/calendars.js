const API_BASE = 'http://192.168.32.52:8000/api/';
const API_ENDPOINT_TYPE = 'calendar/'
const API_URL = API_BASE + API_ENDPOINT_TYPE

const API_ENDPOINTS = {
    ADD_CALENDAR: API_URL,
    LOAD_CALENDAR: API_URL,
    UPDATE_CALENDAR: API_URL,
    DELETE_CALENDAR: API_URL,
    IMPORT_CALENDAR: API_URL + 'import/'
}

const post = (url, body, dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
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

const put = (url, body, dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
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


export const addCalendar = (body) => (dispatch, getState) => post(API_ENDPOINTS.ADD_CALENDAR, body, dispatch, getState).then(res => {
    if (res.status === 200 || res.status === 201) {
        dispatch({type: 'ADD_CALENDAR_SUCCESSFUL', calendars: res.data});
        return res.data;
    }
})


export const loadCalendars = (importCalendar = false) => (dispatch, getState) => {
    let params = ""
    if (importCalendar === true) {
        params = "?import=true"
    }
    return get(API_ENDPOINTS.LOAD_CALENDAR + params, dispatch, getState).then(res => {
        if (res.status === 200) {
            if (importCalendar === true) {
                dispatch({type: 'LOAD_IMPORT_CALENDARS_SUCCESSFUL', import: res.data});
            } else {
                dispatch({type: 'LOAD_CALENDARS_SUCCESSFUL', calendars: res.data});
            }
            return res.data;
        } else {
            dispatch({type: 'CALENDAR_ERROR', calendars: res.data});
            return res.data;
        }

    })
}


export const updateCalendar = (index, body) => (dispatch, getState) => {
    let params = index + "/"
    return put(API_ENDPOINTS.UPDATE_CALENDAR + params, body, dispatch, getState).then(res => {
        if (res.status === 200) {
            dispatch({type: 'UPDATE_CALENDAR_SUCCESSFUL', calendars: res.data});
            return res.data;
        } else {
            dispatch({type: 'CALENDAR_ERROR', calendars: res.data});
            return res.data;
        }
    })
}


export const deleteCalendar = (id) => (dispatch, getState) => {
    let params = id + "/"
    return del(API_ENDPOINTS.DELETE_CALENDAR + params, dispatch, getState).then(res => {
        if (res.status === 200) {
            dispatch({type: 'DELETE_CALENDAR_SUCCESSFUL', calendars: res.data});
            return res.data;
        } else {
            dispatch({type: 'CALENDAR_ERROR', calendars: res.data});
            return res.data;
        }
    })
}


export const importCalendars = (calendarsId) => (dispatch, getState) => {
    let params = "?id=" + calendarsId
    return get(API_ENDPOINTS.IMPORT_CALENDAR + params, dispatch, getState).then(res => {
        if (res.status === 200) {
            dispatch({type: 'IMPORT_CALENDAR_SUCCESSFUL', calendars: res.data});
            return res.data;
        } else {
            dispatch({type: 'CALENDAR_ERROR', calendars: res.data});
            return res.data;
        }
    })
}
