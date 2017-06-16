import { createReducer } from '../utils/misc';
import {
  PUFF_VALUE,
  TIMES_PER_DAY_VALUE,
  DOSE_ICS_VALUE
} from '../constants/index';

const initialState = {
  puffValue: '',
  timesPerDayValue: '',
  doseICSValue: '',
};

export default createReducer(initialState, {
  [PUFF_VALUE]: (state, payload) =>
    Object.assign({}, state, {
      puffValue: payload.puffValue
    }),
  [TIMES_PER_DAY_VALUE]: (state, payload) =>
    Object.assign({}, state, {
      timesPerDayValue: payload.timesPerDayValue
    }),
  [DOSE_ICS_VALUE]: (state, payload) =>
    Object.assign({}, state, {
      doseICS: payload.doseICSValue,
    }),
});
