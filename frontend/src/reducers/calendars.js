const initialState = [];

export default function calendars(state = initialState, action) {

    switch (action.type) {
        case 'CALENDAR_ERROR':
            return {...state, errors: action.data};

        case 'SERVER_ERROR':
            return {...state, errors: action.data};

        case 'ADD_CALENDAR_SUCCESSFUL':
            return [...action.data];

        case 'UPDATE_CALENDAR_SUCCESSFUL':
            return [...action.data];

        case 'IMPORT_CALENDAR_SUCCESSFUL':
            return [...action.data];

        case 'DELETE_CALENDAR_SUCCESSFUL':
            return [...action.data];

        case 'LOAD_CALENDARS_SUCCESSFUL':
            return [...action.data];


        default:
            return state;
    }
}