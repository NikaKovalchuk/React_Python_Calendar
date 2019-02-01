const initialState = [];

export default function calendars(state = initialState, action) {

    switch (action.type) {
        case 'ADD_CALENDAR':
            return [...state];

        case 'UPDATE_CALENDAR':
            return [...state];

        case 'IMPORT_CALENDAR':
            return [...state];

        case 'DELETE_CALENDAR':
            return [...state];

        case 'LOAD_CALENDARS':
            return [...action.calendars];


        default:
            return state;
    }
}