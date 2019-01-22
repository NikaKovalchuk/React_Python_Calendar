const initialState = [];

export default function events(state = initialState, action) {

    switch (action.type) {

        case 'ADD_EVENT':
            return [...state];

        case 'UPDATE_EVENT':
            return [...state];

        case 'DELETE_EVENT':
            return [...state, ...action.events];

        case 'FETCH_EVENTS':
            return [...state, ...action.events];

        case 'LOAD_EVENT':
            return [...state, action.event];

        case 'EVENT_ERROR':
            return [...state, action.event];

        case 'LOAD_EVENTS':
            return [...action.events];

        default:
            return state;
    }
}