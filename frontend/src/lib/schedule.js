export function getHourIndexes() {
    let hours = []
    for (let index=0; index<24; index++) hours.push(index)
    return hours
}

export function getDayIndexesForWeek() {
    let days = []
    for (let index=0; index<7; index++) days.push(index)
    return days
}
export function getDayIndexesForMonth(monthLength) {
    let days = []
    for (let index=0; index<monthLength; index++) days.push(index)
    return days

}