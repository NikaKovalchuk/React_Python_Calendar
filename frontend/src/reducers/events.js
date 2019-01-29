const initialState = [];

export default function events(state = initialState, action) {

    switch (action.type) {

        case 'ADD_EVENT':
            return [...state];

        case 'UPDATE_EVENT':
            return [...state];

        case 'DELETE_EVENT':
            return [...state];

        case 'FETCH_EVENTS':
            return [...state, ...action.events];

        case 'LOAD_EVENT':
            return [...state, action.event];

        case 'EVENT_ERROR':
            return [...state, action.event];

        case 'LOAD_EVENTS':
            return [...action.events];

        case 'LOAD_NOTIFICATIONS':
            return [...action.events];

        case 'ADD_CALENDAR':
            return [...state];

        case 'UPDATE_CALENDAR':
            return [...state];

        case 'DELETE_CALENDAR':
            return [...state];

        case 'LOAD_CALENDARS':
            return [...action.calendars];


        default:
            return state;
    }
}