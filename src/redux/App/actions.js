import { PUFF_VALUE, TIMES_PER_DAY_VALUE, DOSE_ICS_VALUE } from './constants';


export const getPuffValue = ( puffValue ) => {
  console.log(puffValue);
  return {
    type: PUFF_VALUE,
    data: puffValue,
  };
};

export const getTimesPerDayValue = ( timesPerDayValue ) => {
  console.log(timesPerDayValue);
  return {
    type: TIMES_PER_DAY_VALUE,
    data: timesPerDayValue,
  };
};

export const getDoseICSValue = ( doseICSValue ) => {
  console.log(doseICSValue);
  return {
    type: DOSE_ICS_VALUE,
    data: doseICSValue,
  };
};