const initialState = {
    events: [],
    notifications: [],
    errors: [],
};

export default function events(state = initialState, action) {

    switch (action.type) {
        case 'SERVER_ERROR':
        case 'EVENT_ERROR':
        case 'NOTIFICATION_ERROR':
            return {...state, errors: action.data};

        case 'ADD_EVENT':
        case 'UPDATE_EVENT':
        case 'DELETE_EVENT':
        case 'LOAD_EVENTS':
            return {...state, events: action.events};

        case 'LOAD_NOTIFICATIONS':
            return {...state, notifications: action.notifications};

        default:
            return state;
    }
}