const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: true,
    user: null,
    errors: {},
};


export default function auth(state = initialState, action) {

    switch (action.type) {

        case 'USER_LOADING':
            console.log('USER_LOADING')
            return {...state, isLoading: true};

        case 'USER_LOADED':
            console.log('USER_LOADED')
            var logedin = false
            for (var field = 0; field < action.user.length; field++) {
                if (action.user[field] !== "" || action.user[field] !== "") {
                    logedin = true
                }
            }
            if (logedin) {
                return {...state, isAuthenticated: true, isLoading: false, user: action.user};
            } else {
                return {...state, isAuthenticated: false, isLoading: false, user: null}; // TODO: change user to  action.user ---------
            }

        case 'LOGIN_SUCCESSFUL':
            console.log('LOGIN_SUCCESSFUL')
            console.log(action)
            localStorage.setItem("token", action.token);
            return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null};

        case 'AUTHENTICATION_ERROR':
            console.log('AUTHENTICATION_ERROR')
            return {...state, ...action.data, isAuthenticated: false, isLoading: false, errors: action.data};

        case 'LOGIN_FAILED':
            console.log('LOGIN_FAILED')
            return {...state, ...action.data, isAuthenticated: false, isLoading: false, errors: action.data};

        case 'CHANGE_PASSWORD_SUCCESSFUL':
            break

        case 'CHANGE_PASSWORD_FAILED':
            console.log('CHANGE_PASSWORD_FAILED')
            return {...state, ...action.data, isAuthenticated: false, isLoading: false, errors: action.data};

        case 'LOGOUT_SUCCESSFUL':
            console.log('LOGOUT_SUCCESSFUL')
            localStorage.removeItem("token");
            return {
                ...state, errors: action.data, token: null, user: null,
                isAuthenticated: false, isLoading: false
            };

        case 'REGISTRATION_FAILED':
            console.log('REGISTRATION_FAILED')
            return {...state, ...action.data, isAuthenticated: false, isLoading: false, errors: action.data};

        case 'REGISTRATION_SUCCESSFUL':
            console.log('REGISTRATION_SUCCESSFUL')
            return {
                ...state, errors: action.data, token: null, user: null,
                isAuthenticated: false, isLoading: false
            };


        default:
            console.log('default')
            return state;
    }
}