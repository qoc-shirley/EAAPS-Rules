import _ from 'lodash';

export const ICSDose = (medication) => {
  return _.toInteger(medication.doseICS) * _.toInteger(medication.timesPerDay);
};

export const patientICSDose = (medication) => {
  return _.toInteger(medication.doseICS) * _.toInteger(medication.timesPerDay) * _.toInteger(medication.puffPerTime);
};