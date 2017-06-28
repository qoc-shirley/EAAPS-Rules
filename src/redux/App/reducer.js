import {
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
  availableMedications: '',
  medicationList: [],
  results: [],
  patientMedications: [],
};

const reducer = ( state = initialState, action ) => {
  switch(action.type) {
  case MEDICATION_TO_STACK:
    return Object.assign({}, state, {
      medicationList: state.medicationList.concat(action.data)
  });

  // OnChange functions
    case ON_PUFF_CHANGE:
    return Object.assign({}, state, {
      puffValue: action.data,
      medicationList: state.medicationList.map(
        (row,index) =>
          action.data.index === index ?
          { ...row, puffValue: action.data.puffValueChange }
          : row)
  });

  case ON_TIMES_CHANGE:
    return Object.assign({}, state, {
      timesPerDayValue: action.data,
      medicationList: state.medicationList.map(
        (row,index) =>
          action.data.index === index ?
            { ...row, timesPerDayValue: action.data.timesValueChange }
            : row)
  });

  case ON_DOSEICS_CHANGE:
    return Object.assign({}, state, {
      doseICSValue: action.data,
      medicationList: state.medicationList.map(
        (row,index) =>
          action.data.index === index ?
            { ...row, doseICSValue: action.data.doseICSValueChange }
            : row)
  });

  case ON_MEDICATION_SELECTION:
    return Object.assign({}, state, {
      availableMedications: action.data,
      medicationList: state.medicationList.map(
        (row,index) =>
          action.data.index === index ?
            { ...row, availableMedications: {
              chemicalLABA: action.data.selectionChange[0],
              chemicalICS: action.data.selectionChange[1],
              chemicalOther: action.data.selectionChange[2],
            } }
            : row)
  });

  case ON_DELETE_ROW:
    return Object.assign({}, state, {
      medicationList: state.medicationList.filter( (row, index) => {
        return index !== action.data
      })
    }
  );

  case ON_SUBMIT:
    return Object.assign({}, state, {
      results: action.data,
  });

  default:
    return state;
  }
};

export default reducer;
