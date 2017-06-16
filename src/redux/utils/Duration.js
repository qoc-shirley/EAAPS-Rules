// (C) Copyright 2015 Hewlett Packard Enterprise Development LP
/* eslint-disable */
export default function (fromDate, toDate) {
  let numStr, numLabel;
  let delta = toDate.getTime() - fromDate.getTime();
  if (delta < 1000) {
    numStr = (Math.round(delta / 100) / 10).toString();
    numLabel = (numStr === "1") ? " sec" : " secs";
    return numStr + numLabel;
  } else if (delta < 60000) {
    numStr = Math.round(delta / 1000).toString();
    numLabel = (numStr === "1") ? " sec" : " secs";
    return numStr + numLabel;
  } else if (delta < 3600000) {
    numStr = Math.round(delta / 60000).toString();
    numLabel = (numStr === "1") ? " min" : " mins";
    return numStr + numLabel;
  } else if (delta < 86400000) {
    numStr = Math.round(delta / 3600000).toString();
    numLabel = (numStr === "1") ? " hour" : " hours";
    return numStr + numLabel;
  } else {
    numStr = Math.round(delta / 86400000).toString();
    numLabel = (numStr === "1") ? " day" : " days";
    return numStr + numLabel;
  }
}
