const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: localStorage.getItem("token") ? true : false,
    user: null,
    errors: {},
};


export default function auth(state = initialState, action) {

    switch (action.type) {
        case 'REGISTRATION_SUCCESSFUL':
            localStorage.setItem("token", action.data.token);
            state.token = localStorage.getItem("token")
            state.isAuthenticated = true
            return {...state, ...action.data, isAuthenticated: true, errors: null};

        case 'USER_LOADED':
            return {...state, isAuthenticated: true, user: action.user};

        case 'LOGIN_SUCCESSFUL':
            localStorage.setItem("token", action.data.token);
            state.token = localStorage.getItem("token")
            state.isAuthenticated = true
            return {...state, ...action.data, isAuthenticated: true, errors: null};

        case 'AUTHENTICATION_ERROR':
        case 'LOGIN_FAILED':
        case 'REGISTRATION_FAILED':
        case 'LOGOUT':
            localStorage.removeItem("token");
            state.token = localStorage.getItem("token")
            state.isAuthenticated = false
            return {...state, errors: action.data, token: null, user: null, isAuthenticated: false};

        default:
            return state;
    }
}