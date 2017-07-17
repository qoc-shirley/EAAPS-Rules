import _ from 'lodash';

export const ICSDose = (medication) => {
  return _.toInteger(medication.doseICS) * _.toInteger(medication.timesPerDay);
};

export const patientICSDose = (medication) => {
  if (medication.doseICS === "."){
    return _.toInteger(medication.timesPerDay) * _.toInteger(medication.puffPerTime);
  }
  else if (medication.timesPerDay === "."){
    return _.toInteger(medication.doseICS) * _.toInteger(medication.puffPerTime);
  }
  else if (medication.puffPerTime === "") {
    return _.toInteger(medication.doseICS) * _.toInteger(medication.timesPerDay)
  }
  return _.toInteger(medication.doseICS) * _.toInteger(medication.timesPerDay) * _.toInteger(medication.puffPerTime);
};