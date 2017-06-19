import { createReducer } from '../utils/misc';
import {
  PUFF_VALUE,
  TIMES_PER_DAY_VALUE,
  DOSE_ICS_VALUE
} from '../constants/index';

export const state = {
  puffValue: '',
  timesPerDayValue: '',
  doseICSValue: '',
};

export default createReducer( state, {
  [PUFF_VALUE]: (state, data) =>
    Object.assign({}, state, {
      puffValue: data,
    }),
  [TIMES_PER_DAY_VALUE]: (state, data) =>
    Object.assign({}, state, {
      timesPerDayValue: data,
    }),
  [DOSE_ICS_VALUE]: (state, data) =>
    Object.assign({}, state, {
      doseICS: data,
    }),
});

/*const reducer = ({ state , action }) => {
  switch(action.type) {
    case "PUFF_VALUE":
      return Object.assign({}, state, {
        puffValue: action.data
    });

    case "TIMES_PER_DAY_VALUE":
    return Object.assign({}, state, {
      timesPerDayValue: action.data
    });

  case "DOSE_ICS_VALUE":
    return Object.assign({}, state, {
      doseICSValue: action.data
    });
  default:
    return state;
  }
};

export default reducer;*/
