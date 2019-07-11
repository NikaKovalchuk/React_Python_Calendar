import * as types from "./actionTypes";

export const registerUser = (username, password) => ({type: types.REGISTER_USER, username, password});
export const registerUserFailed = () => ({type: types.REGISTER_USER_FAILED});
export const loginUser = (username, password) => ({type: types.LOGIN_USER, username, password});
export const loginUserFailed = () => ({type: types.LOGIN_USER_FAILED});
export const loadUser = () => ({type: types.LOAD_USER});
export const loadUserFailed = () => ({type: types.LOAD_USER_FAILED});

// Calendar
export const loadCalendars = (importCalendar) => ({type: types.LOAD_CALENDARS, importCalendar});
export const importCalendars = (calendarsId) => ({type: types.IMPORT_CALENDARS, calendarsId});
export const addCalendar = (calendar) => ({type: types.NEW_CALENDAR, calendar});
export const updateCalendar = (calendar) => ({type: types.UPDATE_CALENDAR, calendar});
export const deleteCelandar = (id) => ({type: types.DELETE_CALENDAR, id});
export const loadCalendarsFailed = () => ({type: types.LOAD_CALENDARS_FAILED});
export const importCalendarsFailed = () => ({type: types.IMPORT_CALENDARS_FAILED});
export const addCalendarFailed = () => ({type: types.NEW_CALENDAR_FAILED});
export const updateCalendarFailed = () => ({type: types.UPDATE_CALENDAR_FAILED});
export const deleteCelandarFailed = () => ({type: types.DELETE_CALENDAR_FAILED});

//Date
export const updateSelectedDate = (date) => ({type: types.UPDATE_SELECTED_DATE, date});
export const updateViewDate = (date) => ({type: types.UPDATE_VIEW_DATE, date});

// Event
export const loadEvents = (date, calendars) => ({type: types.LOAD_EVENTS, date, calendars});
export const addEvent = (event) => ({type: types.NEW_EVENT, event});
export const updateEvent = (event) => ({type: types.UPDATE_EVENT, event});
export const deleteEvent = (id) => ({type: types.DELETE_EVENT, id});
export const loadEventsFailed = () => ({type: types.LOAD_EVENTS_FAILED});
export const addEventFailed = () => ({type: types.NEW_EVENT_FAILED});
export const updateEventFailed = () => ({type: types.UPDATE_EVENT_FAILED});
export const deleteEventFailed = () => ({type: types.DELETE_EVENT_FAILED});

//Notification
export const loadNotifications = (date, calendars) => ({type: types.LOAD_NOTITFICATIONS, date, calendars});
export const loadNotificationsfailed = () => ({type: types.LOAD_NOTITFICATIONS_FAILED});

//Routed
export const routeLogin = () => ({type: types.ROUTE_LOGIN});
export const routeRegister = () => ({type: types.ROUTE_REGISTER});
export const routeHome = () => ({type: types.ROUTE_HOME});