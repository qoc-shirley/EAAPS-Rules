import {
  PUFF_VALUE,
  TIMES_PER_DAY_VALUE,
  DOSE_ICS_VALUE,
  MEDICATION_SELECTION
} from './constants';

export const initialState = {
  puffValue: '',
  timesPerDayValue: '',
  doseICSValue: '',
  medicationSelection: '',
};

const reducer = ( state = initialState, action ) => {
  switch(action.type) {
    case PUFF_VALUE:
      return Object.assign({}, state, {
        puffValue: action.data
    });

    case TIMES_PER_DAY_VALUE:
    return Object.assign({}, state, {
      timesPerDayValue: action.data
    });

  case DOSE_ICS_VALUE:
    return Object.assign({}, state, {
      doseICSValue: action.data
    });

  case MEDICATION_SELECTION:
    return Object.assign({}, state, {
      medicationSelection: action.data
  });

  default:
    return state;
  }
};

export default reducer;
