const initialState = [];

export default function events(state = initialState, action) {
    let eventList = state.slice();

    switch (action.type) {

        case 'ADD_EVENT':
            return [...state, ...action.events];

        case 'UPDATE_EVENT':
            let eventToUpdate = eventList[action.index]
            eventToUpdate.text = action.event.text;
            eventList.splice(action.index, 1, eventToUpdate);
            return eventList;

        case 'DELETE_EVENT':
            return [...state, ...action.events];

        case 'FETCH_EVENTS':
            return [...state, ...action.events];

        case 'LOAD_EVENT':
            return [...state, ...action.events];

        default:
            return state;
    }
}