const initialState = {
    selectedDate: new Date(new Date().setHours(0, 0, 0)),
    viewDate: new Date(new Date().setHours(0, 0, 0)),
    calendars: [],
    import: [],
};

export default function calendars(state = initialState, action) {

    switch (action.type) {
        case "UPDATE_SELECTED_DATE":
            return {...state, selectedDate: action.selectedDate, viewDate: action.selectedDate,};

        case "UPDATE_VIEW_DATE":
            return {...state, viewDate: action.viewDate};

        case 'ADD_CALENDAR_SUCCESSFUL':
        case 'UPDATE_CALENDAR_SUCCESSFUL':
        case 'IMPORT_CALENDAR_SUCCESSFUL':
        case 'DELETE_CALENDAR_SUCCESSFUL':
        case "LOAD_CALENDARS_SUCCESSFUL":
            return {...state, calendars: action.calendars};

        case 'LOAD_IMPORT_CALENDARS_SUCCESSFUL':
            return {...state, import: action.import};

        case 'CALENDAR_ERROR':
            return {...state, errors: action.calendars};

        case 'SERVER_ERROR':
            return {...state, errors: action.data};

        default:
            return state;
    }
}