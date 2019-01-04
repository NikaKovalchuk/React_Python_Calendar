export const loadUser = () => {
    return (dispatch, getState) => {
        dispatch({type: "USER_LOADING"});

        const token = getState().auth.token;

        let headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        return fetch("http://localhost:8000/api/user/current", {headers,})
            .then(res => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return {status: res.status, data};
                    })
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 200) {
                    dispatch({type: 'USER_LOADED', user: res.data});
                    return res.data;
                } else if (res.status >= 400 && res.status < 500) {
                    dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
                    throw res.data;
                }
            })
    }
}

export const login = (body) => {
    return (dispatch, getState) => {
        var formData = new FormData();
        formData.append("login", body.email);
        formData.append("password", body.password);
        return fetch("http://localhost:8000/api/auth/login/", { body:formData, method: "POST"})
            .then(res => {
                if (res.status < 500) {
                    return {status: res.status, data: JSON.stringify(res)}; // TODO send response not {}
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    dispatch({type: 'LOGIN_SUCCESSFUL', data: res.data});
                    return res.data;
                } else if (res.status === 403 || res.status === 401) {
                    dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
                    throw res.data;
                } else {
                    dispatch({type: "LOGIN_FAILED", data: res.data});
                    throw res.data;
                }
            })
    }
}

export const registration = (body) => {
    return (dispatch) => {
        var formData = new FormData();
        formData.append("email", body.email);
        formData.append("password1", body.password1);
        formData.append("password2", body.password2);
        return fetch("http://localhost:8000/api/auth/signup/", { body:formData, method: "POST"})
            .then(res => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return {status: res.status, data};
                    })
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 200) {
                    dispatch({type: 'REGISTER_SUCCESSFUL', data: res.data});
                    return res.data;
                } else if (res.status === 403 || res.status === 401) {
                    dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
                    throw res.data;
                } else {
                    dispatch({type: "REGISTER_FAILED", data: res.data});
                    throw res.data;
                }
            })
    }
}

export const changePassword = (body) => {
    return (dispatch) => {
        var formData = new FormData();
        formData.append("oldpassword", body.oldpassword);
        formData.append("password1", body.password1);
        formData.append("password2", body.password2);
        return fetch("http://localhost:8000/api/auth/password/change/", { body:formData, method: "POST"})
            .then(res => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return {status: res.status, data};
                    })
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 200) {
                    dispatch({type: 'CHANGE_PASSWORD_SUCCESSFUL', data: res.data});
                    return res.data;
                } else if (res.status === 403 || res.status === 401) {
                    dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
                    throw res.data;
                } else {
                    dispatch({type: "CHANGE_PASSWORD_FAILED", data: res.data});
                    throw res.data;
                }
            })
    }
}

export const logout = () => {
    return (dispatch, getState) => {
        let headers = {"Content-Type": "application/json"};

        return fetch("http://localhost:8000/api/auth/logout/", {headers, body: "", method: "POST"})
            .then(res => {
                if (res.status === 204) {
                    return {status: res.status, data: {}};
                } else if (res.status < 500) {
                    return res.json().then(data => {
                        return {status: res.status, data};
                    })
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 204) {
                    dispatch({type: 'LOGOUT_SUCCESSFUL'});
                    return res.data;
                } else if (res.status === 403 || res.status === 401) {
                    dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
                    throw res.data;
                }
            })
    }
}