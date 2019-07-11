import {combineReducers} from 'redux';
import events from "./events";
import auth from "./auth";
import calendars from "./calendars"

export const reducers = combineReducers({
    events,
    auth,
    calendars,
});