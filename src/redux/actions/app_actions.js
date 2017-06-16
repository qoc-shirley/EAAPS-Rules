import { PUFF_VALUE, TIMES_PER_DAY_VALUE, DOSE_ICS_VALUE } from '../constants/index';


export const getPuffValue = ( puffValue ) => {
  return {
    type: PUFF_VALUE,
    payload: { puffValue },
  };
};

export const getTimesPerDayValue = ( timesPerDayValue ) => {
  return {
    type: TIMES_PER_DAY_VALUE,
    payload: { timesPerDayValue },
  };
};

export const getDoseICSValue = ( doseICSValue ) => {
  return {
    type: DOSE_ICS_VALUE,
    payload: { doseICSValue },
  };
};