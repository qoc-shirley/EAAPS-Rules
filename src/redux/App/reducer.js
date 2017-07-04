import {
  ON_SUBMIT,
  ON_DELETE_ROW,
  ON_PUFF_CHANGE,
  ON_TIMES_CHANGE,
  ON_DOSEICS_CHANGE,
  DEVICE,
  MEDICATION_TO_STACK,
  FILTERED_MEDICATIONS,
  RECOMMENDATION,
  CLEAR,
  ON_CHEMICALICS_SELECTION,
  ON_CHEMICALLABA_SELECTION,
  MEDICATION_NAME,
} from './constants';

export const initialState = {
  puffValue: '',
  timesPerDayValue: '',
  doseICSValue: '',
  chemicalLABA: '',
  chemicalICS: '',
  deviceName: '',
  medicationList: [],
  medicationName: '',
  results: [],
  patientMedications: [],
  recommendation: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MEDICATION_TO_STACK:
      return Object.assign({}, state, {
        medicationList: state.medicationList.concat(action.data)
      });
    case DEVICE:
      return Object.assign({}, state, {
        deviceName: action.data.device[0],
        medicationList: state.medicationList.map(
          (row, index) =>
            action.data.index === index ?
              { ...row, deviceName: action.data.device[0] }
              : row)
      });
    case MEDICATION_NAME:
      return Object.assign({}, state, {
        medicationName: action.data.medicationName[0],
        medicationList: state.medicationList.map(
          (row, index) =>
            action.data.index === index ?
              { ...row, medicationName: action.data.medicationName[0] }
              : row)
      });

    // OnChange functions
    case ON_PUFF_CHANGE:
      return Object.assign({}, state, {
        puffValue: action.data,
        medicationList: state.medicationList.map(
          (row, index) =>
            action.data.index === index ?
              { ...row, puffValue: action.data.puffValueChange }
              : row)
      });

    case ON_TIMES_CHANGE:
      return Object.assign({}, state, {
        timesPerDayValue: action.data,
        medicationList: state.medicationList.map(
          (row, index) =>
            action.data.index === index ?
              { ...row, timesPerDayValue: action.data.timesValueChange }
              : row)
      });

    case ON_DOSEICS_CHANGE:
      return Object.assign({}, state, {
        doseICSValue: action.data,
        medicationList: state.medicationList.map(
          (row, index) =>
            action.data.index === index ?
              { ...row, doseICSValue: action.data.doseICSValueChange }
              : row)
      });

    case ON_CHEMICALICS_SELECTION:
      return Object.assign({}, state, {
        chemicalICS: action.data.chemicalICS[0],
        medicationList: state.medicationList.map(
          (row, index) =>
            action.data.index === index ?
              {
                ...row, chemicalICS: action.data.chemicalICS[0],
              }
              : row)
      });
    case ON_CHEMICALLABA_SELECTION:
      return Object.assign({}, state, {
        chemicalLABA: action.data.chemicalLABA[0],
        medicationList: state.medicationList.map(
          (row, index) =>
            action.data.index === index ?
              {
                ...row, chemicalLABA: action.data.chemicalLABA[0],
              }
              : row)
      });

    case FILTERED_MEDICATIONS:
      return Object.assign({}, state, {
        patientMedications: action.data,
      });
    case RECOMMENDATION:
      return Object.assign({}, state, {
        recommendation: state.recommendation.concat(action.data.medications),
      });
    case CLEAR:
      return Object.assign({}, state, {
          recommendation: [],
        }
      );
    case ON_DELETE_ROW:
      return Object.assign({}, state, {
          medicationList: state.medicationList.filter((row, index) => {
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
