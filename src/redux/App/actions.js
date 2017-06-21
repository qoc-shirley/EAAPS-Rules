import {
  PUFF_VALUE,
  TIMES_PER_DAY_VALUE,
  DOSE_ICS_VALUE,
  MEDICATION_SELECTION } from './constants';


export const getPuffValue = ( puffValue ) => {
  // console.log("action PUFF_VALUE:", puffValue);
  return {
    type: PUFF_VALUE,
    data: puffValue,
  };
};

export const getTimesPerDayValue = ( timesPerDayValue ) => {
  // console.log("action TIMES_PER_DAY_VALUE: ",timesPerDayValue);
  return {
    type: TIMES_PER_DAY_VALUE,
    data: timesPerDayValue,
  };
};

export const getDoseICSValue = ( doseICSValue ) => {
  // console.log("action DOSE_ICS_VALUE: ", doseICSValue);
  return {
    type: DOSE_ICS_VALUE,
    data: doseICSValue,
  };
};

export const getMedicationSelection = ( medicationSelection ) => {
  return {
    type: MEDICATION_SELECTION,
    data: medicationSelection,
  }
};