import {
  PUFF_VALUE,
  TIMES_PER_DAY_VALUE,
  DOSE_ICS_VALUE,
  MEDICATION_SELECTION,
  ON_SUBMIT,
  ON_DELETE_ROW,
  ON_PUFF_CHANGE,
  ON_TIMES_CHANGE,
  ON_DOSEICS_CHANGE,
  ON_MEDICATION_SELECTION,
  MEDICATION_TO_STACK,
} from './constants';

export const initialState = {
  puffValue: '',
  timesPerDayValue: '',
  doseICSValue: '',
  medicationSelection: '',
  stack: [],
  results: [],
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

  case MEDICATION_TO_STACK:
    return Object.assign({}, state, {
      stack: state.stack.concat(action.data)
  });

  // OnChange functions
    case ON_PUFF_CHANGE:
    return Object.assign({}, state, {
      puffValue: action.data,
      stack: state.stack.map(
        (row,index) =>
          action.data.index === index ?
          { ...row, puffValue: action.data.puffValueChange }
          : row)
  });

  case ON_TIMES_CHANGE:
    return Object.assign({}, state, {
      timesPerDayValue: action.data,
      stack: state.stack.map(
        (row,index) =>
          action.data.index === index ?
            { ...row, timesPerDayValue: action.data.timesValueChange }
            : row)
  });

  case ON_DOSEICS_CHANGE:
    return Object.assign({}, state, {
      doseICSValue: action.data,
      stack: state.stack.map(
        (row,index) =>
          action.data.index === index ?
            { ...row, doseICSValue: action.data.doseICSValueChange }
            : row)
  });

  case ON_MEDICATION_SELECTION:
    return Object.assign({}, state, {
      medicationSelection: action.data,
      stack: state.stack.map(
        (row,index) =>
          action.data.index === index ?
            { ...row, medicationSelection: action.data.selectionChange }
            : row)
  });

  case ON_DELETE_ROW:
    return Object.assign({}, state, {
      stack: state.stack.filter( (row, index) => {
        return index !== action.data
      })
    }
  );

  case ON_SUBMIT:
    return Object.assign({}, state, {
      results: action.data
  });

  default:
    return state;
  }
};

export default reducer;
