import { combineReducers } from 'redux';
import events from "./events";


const app = combineReducers({
  events,
})

export default app;