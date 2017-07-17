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
import _ from 'lodash';
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
  isRecommendationEmpty: true,
  isRuleSelectEmpty: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MEDICATION_TO_STACK:
      return Object.assign({}, state, {
        medicationList: state.medicationList.concat(action.data),
        isRecommendationEmpty: true,
        isRuleSelectEmpty: true,
        recommendation: [],
        patientMedications: [],
      });
    case DEVICE:
      return Object.assign({}, state, {
        deviceName: action.data.device[0],
        medicationList: state.medicationList.map(
          (row, index) =>
            action.data.index === index ?
              {...row, deviceName: action.data.device[0]}
              : row),
        isRecommendationEmpty: true,
        isRuleSelectEmpty: true,
        recommendation: [],
        medicationName: '',
        chemicalLABA: '',
        chemicalICS: '',
      });
    case MEDICATION_NAME:
      return Object.assign({}, state, {
        medicationName: action.data.medicationName[0],
        medicationList: state.medicationList.map(
          (row, index) =>
            action.data.index === index ?
              {...row, medicationName: action.data.medicationName[0]}
              : row),
        isRecommendationEmpty: true,
        isRuleSelectEmpty: true,
        recommendation: [],
        chemicalLABA: '',
        chemicalICS: '',
      });

    // OnChange functions
    case ON_PUFF_CHANGE:
      return Object.assign({}, state, {
        puffValue: action.data.puffValueChange,
        medicationList: state.medicationList.map(
          (row, index) =>
            action.data.index === index ?
              {...row, puffValue: action.data.puffValueChange}
              : row),
        isRecommendationEmpty: true,
        isRuleSelectEmpty: true,
        recommendation: [],
      });

    case ON_TIMES_CHANGE:
      return Object.assign({}, state, {
        timesPerDayValue: action.data,
        medicationList: state.medicationList.map(
          (row, index) =>
            action.data.index === index ?
              {...row, timesPerDayValue: action.data.timesValueChange}
              : row),
        isRecommendationEmpty: true,
        isRuleSelectEmpty: true,
        recommendation: [],
      });

    case ON_DOSEICS_CHANGE:
      return Object.assign({}, state, {
        doseICSValue: action.data,
        medicationList: state.medicationList.map(
          (row, index) =>
            action.data.index === index ?
              {...row, doseICSValue: action.data.doseICSValueChange}
              : row),
        isRecommendationEmpty: true,
        isRuleSelectEmpty: true,
        recommendation: [],
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
              : row),
        isRecommendationEmpty: true,
        isRuleSelectEmpty: true,
        recommendation: [],
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
              : row),
        isRecommendationEmpty: true,
        isRuleSelectEmpty: true,
        recommendation: [],
        chemicalICS: '',
      });

    case FILTERED_MEDICATIONS:
      if (action.data !== []) {
        return Object.assign({}, state, {
          isRecommendationEmpty: false,
          patientMedications: action.data,
        })
      }
      return Object.assign({}, state, {
        patientMedications: action.data,
      });

    case RECOMMENDATION:
      return Object.assign({}, state, {
        isRuleSelectEmpty: false,
        recommendation: state.recommendation.concat(action.data),
      });
    case CLEAR:
      return Object.assign({}, state, {
          isRuleSelectEmpty: true,
          recommendation: [],
        }
      );
    case ON_DELETE_ROW:
      if (action.data === 0) {
        return Object.assign({}, state, {
          isRecommendationEmpty: true,
          medicationList: _.filter(state.medicationList, (row, index) => {
            return index !== action.data
          }),
          isRuleSelectEmpty: true,
          recommendation: [],
          patientMedications: [],
        })
      }
      return Object.assign({}, state, {
          medicationList: _.filter(state.medicationList, (row, index) => {
            return index !== action.data
          }),
          isRecommendationEmpty: true,
          isRuleSelectEmpty: true,
        recommendation: [],
        patientMedications: [],
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
