const initialState = [];

export default function events(state = initialState, action) {

    switch (action.type) {
        case 'SERVER_ERROR':
            return {...state, errors: action.data};

        case 'EVENT_ERROR':
            return {...state, errors: action.data};

        case 'NOTIFICATION_ERROR':
            return {...state, errors: action.data};

        case 'ADD_EVENT':
            return [...state];

        case 'UPDATE_EVENT':
            return { state : state};  //TODO: fix optimization

        case 'DELETE_EVENT':
           return { state : state}; 

        case 'LOAD_EVENTS':
            return {...state, data: action.data};

        case 'LOAD_NOTIFICATIONS':
            return {...state, notifications: action.notifications};

        default:
            return state;
    }
}