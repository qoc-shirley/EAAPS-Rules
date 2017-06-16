/* eslint-disable */
/* eslint max-len: 0, no-param-reassign: 0 */

export function createConstants(...constants) {
    return constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {});
}

export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];


        return reducer
            ? reducer(state, action.payload)
            : state;
    };
}


export function parseJSON(response) {
    return response.data;
}

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


export function getPurple() {
  return "#4D3F99";
}

export function getTeal() {
  return "#5bc5b6";
}

export function getPurpleLite() {
  return "#af81bb";
}

export function getDisplayTime(date){
  const now = (typeof date === "undefined") ? new Date() : date;
  const generalDisplayTime = now.getHours() + ":" + now.getMinutes() + "pm";
  return generalDisplayTime;
}

export function getDaysAsSingleLetters(){
  return ["M", "T", "W","T","F","S","S"];
}

export function getDayOfWeek(date){
  const now = (typeof date === "undefined") ? new Date() : date;
  const dayOfWeekIndex = now.getDay();
  const days = getDaysAsSingleLetters();
  return days[dayOfWeekIndex];
}
