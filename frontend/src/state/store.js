/*
 * @file Creates the store and starts the sagas on it
 */
import {applyMiddleware, createStore} from "redux";
import createSagaMiddleware from "redux-saga";

import {sagas} from "./sagas";
import {reducers} from "./reducers";
import {composeWithDevTools} from "redux-devtools-extension";

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(sagaMiddleware)
  )
);

sagaMiddleware.run(sagas);