import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import MedicationTable from '../MedicationTable/MedicationTable';
import medicationData from '../../medicationData/medicationData';
import DisplayPatientMedications from '../Display/PatientMedications/PatientMedications';
import Recommendations from '../Display/Recommendations/Recommendations';
import Questionnaire from '../Questionnaire/Questionnaire';
import * as getEscalation from '../../rules/escalation/rules';
import * as getDeEscalation from '../../rules/de-escalation/rules';
import './styles.css';

const App = ( {
appendMedicationList,
medication,
onMedicationSelection,
onChangePuffValue,
onChangeTimesPerDayValue,
onChangeDoseICS,
onClickClear,
onDeleteRow,
saveRecommendation,
} ) => {
  let showPatientMedications = null;
  if ( medication.isRecommendationEmpty === false ) {
    showPatientMedications = <DisplayPatientMedications />;
  }
  else if ( medication.isRecommendationEmpty === true ) {
    showPatientMedications = null;
  }

  const escalationRules = () => {
    const clonedMasterMedication = _.cloneDeep( medicationData );
    const clonedMasterMedication2 = _.cloneDeep( medicationData );
    const clonedMasterMedication3 = _.cloneDeep( medicationData );
    const clonedMasterMedication4 = _.cloneDeep( medicationData );
    const clonedMasterMedication5 = _.cloneDeep( medicationData );
    const clonedMasterMedication6 = _.cloneDeep( medicationData );
    const clonedMasterMedication7 = _.cloneDeep( medicationData );
    saveRecommendation( 'Rule -1', getEscalation.rules.ruleMinus1( medication.patientMedications ) );
    saveRecommendation( 'Rule 0', getEscalation.rules.rule0( medication.patientMedications, clonedMasterMedication3 ) );
    saveRecommendation( 'Rule 1', getEscalation.rules.rule1( medication.patientMedications, clonedMasterMedication4 ) );
    saveRecommendation( 'Rule 3', getEscalation.rules.rule3( medication.patientMedications, clonedMasterMedication5 ) );
    saveRecommendation( 'Rule 4', _.flatten(
      getEscalation.rules.rule4( medication.patientMedications, clonedMasterMedication ) ) );
    saveRecommendation( 'Rule 5', getEscalation.rules.rule5( medication.patientMedications, clonedMasterMedication2 ) );
    saveRecommendation( 'Rule 6', getEscalation.rules.rule6( medication.patientMedications ) );
    saveRecommendation( 'Rule 7', getEscalation.rules.rule7( medication.patientMedications ) );
    saveRecommendation( 'Rule 8', getEscalation.rules.rule8( medication.patientMedications, clonedMasterMedication6 ) );
    saveRecommendation( 'Rule 9', getEscalation.rules.rule9( medication.patientMedications ) );
    saveRecommendation( 'Rule 10', getEscalation.rules.rule10( medication.patientMedications ) );
    saveRecommendation( 'Rule 11',
      getEscalation.rules.rule11( medication.patientMedications, clonedMasterMedication7 ) );
  };

  const deescalationRules = () => {
    const clonedMasterMedication = _.cloneDeep( medicationData );
    const asthmaControlAnswers = [
      {
        wakeUp: medication.wakeUp,
        asthmaSymptoms: medication.asthmaSymptoms,
        rescuePuffer: medication.rescuePuffer,
        missedEvent: medication.missedEvent,
        stoppedExercising: medication.stoppedExercising,
      }];
    getDeEscalation.rules.control( asthmaControlAnswers );
    saveRecommendation( 'Rule -1', getDeEscalation.rules.ruleMinus1( medication.patientMedications ) );
    saveRecommendation(
      'Rule 1',
      getDeEscalation.rules.rule1( medication.patientMedications, clonedMasterMedication, asthmaControlAnswers ) );
    saveRecommendation(
      'Rule 2',
      getDeEscalation.rules.rule2( medication.patientMedications, clonedMasterMedication ) );
    saveRecommendation(
      'Rule 3',
      getDeEscalation.rules.rule3(
        medication.patientMedications,
        clonedMasterMedication, asthmaControlAnswers,
      ) );
    saveRecommendation(
      'Rule 4',
      getDeEscalation.rules.rule4( medication.patientMedications, clonedMasterMedication, asthmaControlAnswers ) );
    saveRecommendation(
      'Rule 5',
      getDeEscalation.rules.rule5( medication.patientMedications, clonedMasterMedication, asthmaControlAnswers ) );
  };

  const clearRecommendations = () => {
    onClickClear();
  };

  const showAvailableRules = () => {
    if ( medication.isRecommendationEmpty === false ) {
      return (
        <div className="rules">
          <button
            className="button__runRules"
            onClick={() => escalationRules()}
          >
            Escalation
          </button>
          <button
            className="button__runRules"
            onClick={() => deescalationRules()}
          >
            De-escalation
          </button>
          <input
            className="clear"
            type="submit"
            value="Clear"
            onClick={clearRecommendations}
          />
        </div>
      );
    }
    else if ( medication.isRecommendationEmpty === true ) {
      return null;
    }

    return null;
  };

  const showRecommendation = () => {
    if ( medication.isRuleSelectEmpty === false ) {
      return (
        <div className="displayRecommendations">
          <Recommendations />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app">
      <div className="app__header">
        <Header />
      </div>
      <div className="app__main">
        <Questionnaire />
        <MedicationTable
          onChangeMedication={onMedicationSelection}
          onChangePuffValue={onChangePuffValue}
          onChangeTimesPerDayValue={onChangeTimesPerDayValue}
          onChangeDoseICS={onChangeDoseICS}
          appendMedicationList={appendMedicationList}
          medicationList={medication.medicationList}
          onClickDeleteMedication={onDeleteRow}
        />
        <div className="results">
          {showPatientMedications}
          {showAvailableRules()}
        </div>
        {showRecommendation()}
      </div>
    </div>
  );
};

App.PropTypes = {
  appendMedicationList: PropTypes.func,
  medication: PropTypes.array,
  medicationList: PropTypes.array,
  onChangeDoseICS: PropTypes.func,
  onMedicationSelection: PropTypes.func,
  onChangePuffValue: PropTypes.func,
  onChangeTimesPerDayValue: PropTypes.func,
  onDeleteRow: PropTypes.func,
  saveRecommendation: PropTypes.func,
};

App.defaultProps = {
  medicationList: [],
};
export default App;
