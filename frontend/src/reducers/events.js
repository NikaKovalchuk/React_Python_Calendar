const initialState = [];

export default function events(state=initialState, action) {
  let eventList = state.slice();

  switch (action.type) {

    case 'ADD_EVENT':
      return [...state, action.note];

    case 'UPDATE_NOTE':
      let eventToUpdate = eventList[action.index]
      eventToUpdate.text = action.event.text;
      eventList.splice(action.index, 1, eventToUpdate);
      return eventList;

    case 'DELETE_EVENT':
      eventList.splice(action.id, 1);
      return eventList;

    case 'FETCH_EVENTS':
      return [...state, ...action.events];

    default:
      return state;
  }
}