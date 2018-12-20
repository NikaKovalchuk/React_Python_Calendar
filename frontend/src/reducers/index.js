import { combineReducers } from 'redux';
import events from "./events";
import auth from "./auth";


const app = combineReducers({
  events, auth
})

export default app;