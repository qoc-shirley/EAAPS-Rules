import _ from 'lodash';
import {
  ON_SUBMIT,
  ON_DELETE_ROW,
  ON_PUFF_CHANGE,
  ON_TIMES_CHANGE,
  ON_DOSEICS_CHANGE,
  ON_DOSELABA_CHANGE,
  DEVICE,
  MEDICATION_TO_STACK,
  FILTERED_MEDICATIONS,
  RECOMMENDATION,
  CLEAR,
  ON_CHEMICAL_SELECTION,
  MEDICATION_NAME,
  ON_QUESTIONNAIRE_OPTION,
} from './constants';
export const initialState = {
  puffValue: '',
  timesPerDayValue: '',
  doseICSValue: '',
  doseLabaValue: '',
  chemical: '',
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
  wakeUp: '',
  asthmaSymptoms: '',
  rescuePuffer: '',
  missedEvent: '',
  stoppedExercising: '',
};

const reducer = ( state = initialState, action ) => {
  switch ( action.type ) {
  case MEDICATION_TO_STACK:
    return Object.assign( {}, state, {
      medicationList: state.medicationList.concat( action.data ),
      isRecommendationEmpty: true,
      isRuleSelectEmpty: true,
      recommendation: [],
      patientMedications: [],
    } );
  case DEVICE:
    return Object.assign( {}, state, {
      deviceName: action.data.device[0],
      medicationName: '',
      chemical: '',
      chemicalLABA: '',
      chemicalICS: '',
      doseICSValue: '',
      puffValue: '',
      timesPerDayValue: '',
      medicationList: state.medicationList.map( ( row, index ) =>
          action.data.index === index ?
          { ...row,
            deviceName: action.data.device[0],
            medicationName: '',
            chemicalLABA: '',
            chemicalICS: '',
            doseICSValue: '',
            puffValue: '',
            timesPerDayValue: '',
          }
          : row ),
      isRecommendationEmpty: true,
      isRuleSelectEmpty: true,
      recommendation: [],
    } );
  case MEDICATION_NAME:
    return Object.assign( {}, state, {
      medicationName: action.data.medicationName[0],
      chemicalLABA: '',
      chemical: '',
      chemicalICS: '',
      doseICSValue: '',
      puffValue: '',
      timesPerDayValue: '',
      medicationList: state.medicationList.map( (row, index ) =>
        action.data.index === index ?
        { ...row,
          medicationName: action.data.medicationName[0],
          chemicalLABA: '',
          chemicalICS: '',
          doseICSValue: '',
          puffValue: '',
          timesPerDayValue: '',
        }
          : row ),
      isRecommendationEmpty: true,
      isRuleSelectEmpty: true,
      recommendation: [],
    } );
  case ON_CHEMICAL_SELECTION:
    return Object.assign( {}, state, {
      chemicalLABA: action.data.chemicalLABA[0],
      chemicalICS: action.data.chemicalLABA[1],
      chemical: action.data.chemicalLABA[0] + ' ,' + action.data.chemicalLABA[1],
      doseICSValue: '',
      puffValue: '',
      timesPerDayValue: '',
      medicationList: state.medicationList.map( ( row, index ) =>
        action.data.index === index ?
        {
          ...row,
          chemicalLABA: action.data.chemicalLABA[0],
          chemicalICS: action.data.chemicalLABA[1],
          doseICSValue: '',
          puffValue: '',
          timesPerDayValue: '',
        }
          : row ),
      isRecommendationEmpty: true,
      isRuleSelectEmpty: true,
      recommendation: [],
    } );

  case ON_DOSELABA_CHANGE:
    return Object.assign( {}, state, {
      doseLabaValue: action.data.doseLabaValueChange[0],
      doseICSValue: '',
      puffValue: '',
      timesPerDayValue: '',
      medicationList: state.medicationList.map( ( row, index ) =>
        action.data.index === index ?
        {
          ...row,
          doseLabaValue: action.data.doseICSValueChange[0],
          doseICSValue: '',
          puffValue: '',
          timesPerDayValue: '',
        }
          : row ),
      isRecommendationEmpty: true,
      isRuleSelectEmpty: true,
      recommendation: [],
    } );

  case ON_DOSEICS_CHANGE:
    return Object.assign( {}, state, {
      doseICSValue: action.data.doseICSValueChange[0],
      puffValue: '',
      timesPerDayValue: '',
      medicationList: state.medicationList.map( ( row, index ) =>
        action.data.index === index ?
          {
            ...row,
            doseICSValue: action.data.doseICSValueChange[0],
            puffValue: '',
            timesPerDayValue: '',
          }
          : row ),
      isRecommendationEmpty: true,
      isRuleSelectEmpty: true,
      recommendation: [],
    } );

    // OnChange functions
  case ON_PUFF_CHANGE:
    return Object.assign( {}, state, {
      puffValue: action.data.puffValueChange[0],
      timesPerDayValue: '',
      medicationList: state.medicationList.map( ( row, index ) =>
          action.data.index === index ?
          { ...row,
            puffValue: action.data.puffValueChange[0],
            timesPerDayValue: '',
          }
              : row ),
      isRecommendationEmpty: true,
      isRuleSelectEmpty: true,
      recommendation: [],
    } );

  case ON_TIMES_CHANGE:
    return Object.assign( {}, state, {
      timesPerDayValue: action.data.timesValueChange[0],
      medicationList: state.medicationList.map( ( row, index ) =>
        action.data.index === index ?
        { ...row, timesPerDayValue: action.data.timesValueChange[0] }
              : row ),
      isRecommendationEmpty: true,
      isRuleSelectEmpty: true,
      recommendation: [],
    } );

  case FILTERED_MEDICATIONS:
    if ( action.data !== [] ) {
      return Object.assign({}, state, {
        isRecommendationEmpty: false,
        patientMedications: action.data,
      } );
    }

    return Object.assign( {}, state, {
      patientMedications: action.data,
    } );

  case RECOMMENDATION:
    return Object.assign( {}, state, {
      isRuleSelectEmpty: false,
      recommendation: state.recommendation.concat( action.data ),
    } );
  case CLEAR:
    return Object.assign( {}, state, {
      isRuleSelectEmpty: true,
      recommendation: [],
    } );
  case ON_DELETE_ROW:
    if ( action.data === 0 ) {
      return Object.assign( {}, state, {
        isRecommendationEmpty: true,
        medicationList: _.filter( state.medicationList, ( row, index ) => {
          return index !== action.data;
        } ),
        isRuleSelectEmpty: true,
        recommendation: [],
        patientMedications: [],
      } );
    }

    return Object.assign( {}, state, {
      medicationList: _.filter( state.medicationList, ( row, index ) => {
        return index !== action.data;
      } ),
      isRecommendationEmpty: true,
      isRuleSelectEmpty: true,
      recommendation: [],
      patientMedications: [],
    } );
  case ON_SUBMIT:
    return Object.assign( {}, state, {
      results: action.data,
    } );
  case ON_QUESTIONNAIRE_OPTION:
    if ( action.data.question === 'wakeUp' ) {
      return Object.assign( {}, state, {
        wakeUp: action.data.option,
      } );
    }
    else if ( action.data.question === 'asthmaSymptoms' ) {
      return Object.assign( {}, state, {
        asthmaSymptoms: action.data.option,
      } );
    }
    else if ( action.data.question === 'rescuePuffer' ) {
      return Object.assign( {}, state, {
        rescuePuffer: action.data.option,
      } );
    }
    else if ( action.data.question === 'missedEvent' ) {
      return Object.assign( {}, state, {
        missedEvent: action.data.option,
      } );
    }
    else if ( action.data.question === 'stoppedExercising' ) {
      return Object.assign( {}, state, {
        stoppedExercising: action.data.option,
      } );
    }
    return Object.assign( {}, state, {
      wakeUp: '',
      asthmaSymptoms: '',
      rescuePuffer: '',
      missedEvent: '',
      stoppedExercising: '',
    } );

  default:
    return state;
  }
};

export default reducer;
