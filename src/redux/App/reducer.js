import {
  PUFF_VALUE,
  TIMES_PER_DAY_VALUE,
  DOSE_ICS_VALUE,
  MEDICATION_SELECTION,
  ON_SUBMIT,
  ON_DELETE_ROW,
  ON_PUFF_CHANGE,
} from './constants';

export const initialState = {
  puffValue: '',
  timesPerDayValue: '',
  doseICSValue: '',
  medicationSelection: '',
  onSubmit: '',
  onDeleteRow: '',
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
  case ON_PUFF_CHANGE:
    return Object.assign({}, state, {
      puffValue: action.data
  });
  // if this happens print out the list of patient medications
  case ON_SUBMIT:
    return Object.assign({}, state, {
      onSubmit: action.data
  });

  case ON_DELETE_ROW:
    return Object.assign({}, state, {
      onDeleteRow: action.data
  });

  default:
    return state;
  }
};

export default reducer;
