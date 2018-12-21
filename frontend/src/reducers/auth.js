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
            for (var field=0; field<action.user.length; field++){
                if (action.user[field]!==""||action.user[field]!==""){
                    logedin = true
                }
            }
            if (logedin) {
                return {...state, isAuthenticated: true, isLoading: false, user: action.user};
            } else {
                return {...state, isAuthenticated: false, isLoading: false, user: null};
            }
        case 'LOGIN_SUCCESSFUL':
            console.log('LOGIN_SUCCESSFUL')
            localStorage.setItem("token", action.data.token);
            return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null};

        case 'AUTHENTICATION_ERROR':
        case 'LOGIN_FAILED':
        case 'LOGOUT_SUCCESSFUL':
            console.log('LOGOUT_SUCCESSFUL')
            localStorage.removeItem("token");
            return {
                ...state, errors: action.data, token: null, user: null,
                isAuthenticated: false, isLoading: false
            };

        default:
            console.log('default')
            return state;
    }
}