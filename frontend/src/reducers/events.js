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
            return [...state];

        case 'DELETE_EVENT':
            return [...state];

        case 'FETCH_EVENTS':
            return [...state, ...action.data];

        case 'LOAD_EVENT':
            return [...state, action.data];

        case 'LOAD_EVENTS':
            return [...action.data];

        case 'LOAD_NOTIFICATIONS':
            return [...action.data];

        default:
            return state;
    }
}