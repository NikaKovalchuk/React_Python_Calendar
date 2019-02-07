const initialState = [];

export default function calendars(state = initialState, action) {

    switch (action.type) {
        case 'CALENDAR_ERROR':
            return {...state, errors: action.calendars};

        case 'SERVER_ERROR':
            return {...state, errors: action.data};

        case 'ADD_CALENDAR_SUCCESSFUL':
            return {...state, data: action.calendars};

        case 'UPDATE_CALENDAR_SUCCESSFUL':
            return {...state, data: action.calendars};

        case 'IMPORT_CALENDAR_SUCCESSFUL':
            return {...state, data: action.calendars};

        case 'DELETE_CALENDAR_SUCCESSFUL':
            return {...state, data: action.calendars};

        case 'LOAD_CALENDARS_SUCCESSFUL':
            return {...state, data: action.calendars};

        case 'LOAD_IMPORT_CALENDARS_SUCCESSFUL':
            return {...state, import: action.import};


        default:
            return state;
    }
}