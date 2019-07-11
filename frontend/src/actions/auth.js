const API_BASE = 'http://localhost:8000/api/';
const API_ENDPOINT_TYPE = 'user/'
const API_URL = API_BASE + API_ENDPOINT_TYPE

const API_ENDPOINTS = {
    REGISTER: API_URL + 'signup/',
    LOGIN: API_URL + 'login/',
    CURRENT: API_URL + 'current/',
};

const post = (url, body, dispatch, getState) => {
    let headers = {"Content-Type": "application/json"};
    body = JSON.stringify(body)

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
    const token = getState().auth.token;
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


export const login = (username, password) => (dispatch, getState) => post(API_ENDPOINTS.LOGIN, {
    username,
    password
}, dispatch, getState).then(res => {
    if (res.status === 200) {
        dispatch({type: 'LOGIN_SUCCESSFUL', data: res.data});
        return res.data;
    } else {
        dispatch({type: 'LOGIN_FAILED', data: res.data});
        return res.data;
    }
})

export const register = (username, password) => (dispatch, getState) => post(API_ENDPOINTS.REGISTER, {
    username,
    password
}, dispatch, getState).then(res => {
    if (res.status === 200) {
        dispatch({type: 'REGISTRATION_SUCCESSFUL', data: res.data});
        return res.data;
    } else {
        dispatch({type: 'REGISTRATION_FAILED', data: res.data});
        return res.data;
    }
})

export const loadUser = () => (dispatch, getState) => get(API_ENDPOINTS.CURRENT, dispatch, getState).then(res => {
    if (res.status === 200) {
        dispatch({type: 'USER_LOADED', data: res.data});
        return res.data;
    } else {
        dispatch({type: 'AUTHENTICATION_ERROR', data: res.data});
        return res.data;
    }
})


export const logout = () => {
    return (dispatch) => {
        dispatch({type: 'LOGOUT'});
    }
}