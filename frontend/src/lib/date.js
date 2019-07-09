import moment from "moment";

export function startOfDay(date){
    return moment(date).startOf('day');
}

export function endOfDay(date){
    return moment(date).endOf('day');
}

export function startOfWeek(date){
    return moment(date).startOf('week');
}

export function endOfWeek(date){
    return moment(date).endOf('week');
}

export function startOfMonth(date){
    return moment(date).startOf('month');
}

export function endOfMonth(date){
    return moment(date).endOf('month');
}

export function ISOstring(date){
    return moment(date).toISOString()
}

// export function getHourIndex(){
//    let hours=[];
//    for (let index = 0; index < 24; index++){
//        hours.push(index)
//    }
//    return hours
// }