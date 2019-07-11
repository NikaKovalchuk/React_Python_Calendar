import {all,fork} from "redux-saga/effects";
import {watchUser} from "./user";
import {watchEvents} from "./event";
import {watchCalendars} from "./calendar";
import {watchNotifications} from "./notifications";

export function * sagas() {
    // yield put(setApiStatus(true));
    //
    // yield all([
    //   call(requestRefData),
    //   fork(watchListReload),
    // ]);

//     yield all([
//       fork(watchUser),
//       fork(watchEvents),
//       fork(watchCalendars),
//       fork(watchNotifications),
//     ]);
    console.log('asdada')
}