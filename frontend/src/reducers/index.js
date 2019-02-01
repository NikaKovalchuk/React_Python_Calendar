import {combineReducers} from 'redux';
import events from "./events";
import auth from "./auth";
import calendars from "./calendars"


const app = combineReducers({
    events, auth, calendars
})

export default app;