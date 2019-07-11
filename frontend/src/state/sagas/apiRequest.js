// import {call, put as sagaPut} from "redux-saga/effects";
// import {API_ROOT} from "../config";
//
// // add connection to backend
// function* get(...params) {
//   yield call(apiRequest.get, API_ROOT,...params);
// }
//
// function* post(...params) {
//   yield call(apiRequest.post, API_ROOT, ...params);
// }
//
// function* put(...params) {
//   yield call(apiRequest.put, API_ROOT, ...params);
// }
//
// function* del(...params) {
//   yield call(apiRequest.del, API_ROOT, ...params);
// }
//
// export default {
//   get,
//   post,
//   put,
//   del
// };
//
// //
// // /
// //  * Provide basic request functions for the various APIs.
// //  *
// //  * THIS IS PROBABLY NOT THE MODULE YOU ARE LOOKING FOR!
// //  * There is no checking for errors in this module and thus no permissions
// //  * handling will be performed. Use application specific request sagas instead.
// //  */
//
// import "isomorphic-fetch";
//
// import noop from "../lib/noop";
// import {store} from "../components/CurrentUser/store";
// import {PAYLOAD_UPDATED} from "../components/CurrentUser/actionTypes";
//
// import config from "../config";
//
// const AUTH = config.AUTH || "";
//
// const defaultHeaders = {
//   Authorization: AUTH
// };
//
// // /
// //  * @param {api} The config key for the API to call
// //  * @param {query} Query parameters to attach to the API call
// //  * @param {options} optional options object to send
// //  * @param {body} optional request body
// //  * @param {store} store of the application
// //  */
// const apiRequest = (API_ROOT, query, options = {}, body) => {
//   let resource = query;
//   if (resource.charAt(0) === "/") {
//     resource = query.substring(1);
//   }
//
//   let requestOptions = body ? {...options, body} : options;
//   const responsePromise = fetch(${API_ROOT}/${resource}, {...requestOptions});
//   return responsePromise.then(
//     (response) => {
//       const headerString = response.headers.get("X-HUB-DATA");
//       if (headerString) {
//         try {
//           const headerData = JSON.parse(headerString);
//           store.dispatch({type: PAYLOAD_UPDATED, data: headerData});
//         } catch (e) {
//           noop(); // Do nothing; we don't care here.
//         }
//       }
//       return response;
//     },
//   );
// };
//
// const get = (api, query) => {
//   return apiRequest(api, query, {headers: defaultHeaders});
// };
//
// const post = (api, query, payload) => {
//   const headers = {
//     "content-type": "application/json",
//     ...defaultHeaders
//   };
//   return apiRequest(
//     api,
//     query,
//     {headers, method: "POST"},
//     JSON.stringify(payload)
//   );
// };
//
// const patch = (api, query, payload) => {
//   const headers = {
//     "content-type": "application/json",
//     ...defaultHeaders
//   };
//   return apiRequest(
//     api,
//     query,
//     {headers, method: "PATCH"},
//     JSON.stringify(payload)
//   );
// };
//
// const put = (api, query, payload) => {
//   const headers = {
//     "content-type": "application/json",
//     ...defaultHeaders
//   };
//   return apiRequest(
//     api,
//     query,
//     {headers, method: "PUT"},
//     JSON.stringify(payload)
//   );
// };
//
// const del = (api, query, payload) => {
//   const headers = {
//     "content-type": "application/json",
//     ...defaultHeaders
//   };
//
//   // TODO: Clean this up.
//   if (payload) {
//     return apiRequest(api, query, {headers, method: "DELETE"}, JSON.stringify(payload));
//   } else {
//     return apiRequest(api, query, {headers, method: "DELETE"});
//   }
// };
//
// export default {
//   get,
//   post,
//   patch,
//   put,
//   del
// };
