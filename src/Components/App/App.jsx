import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import MedicationTable from '../MedicationTable/MedicationTable';
import medicationData from '../../medicationData/medicationData';
import DisplayPatientMedications from '../Display/PatientMedications/PatientMedications';
import Recommendations from '../Display/Recommendations/Recommendations';
import * as get from '../../rules/rules';
import './styles.css';

const App = ({
               appendMedicationList,
               medication,
               onMedicationSelection,
               onChangePuffValue,
               onChangeTimesPerDayValue,
               onChangeDoseICS,
               onClickClear,
               onDeleteRow,
               saveRecommendation,
             }) => {

  let showPatientMedications = null;
  if (medication.isRecommendationEmpty === false) {
    showPatientMedications = <DisplayPatientMedications />;
  }
  else if (medication.isRecommendationEmpty === true) {
    showPatientMedications = null;
  }

  const showAvailableRules = () => {
    if (medication.isRecommendationEmpty === false) {
      return (
        <div className="rules">
          <button
            className="button__runRules"
            onClick={() => onChangeRule()}
          >
            Run Rules
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
    else if (medication.isRecommendationEmpty === true) {
      return null;
    }
  };

  const onChangeRule = () => {
    saveRecommendation("Rule -1", get.rules.ruleMinus1(medication.patientMedications));
    saveRecommendation("Rule 0", get.rules.rule0(medication.patientMedications, medicationData));
    saveRecommendation("Rule 1", get.rules.rule1(medication.patientMedications, medicationData));
    saveRecommendation("Rule 3", get.rules.rule3(medication.patientMedications, medicationData));
    saveRecommendation("Rule 4", _.flatten(get.rules.rule4(medication.patientMedications, medicationData)));
    saveRecommendation("Rule 5", get.rules.rule5(medication.patientMedications, medicationData));
    // saveRecommendation("Rule 6", get.rules.rule6(medication.patientMedications));
    saveRecommendation("Rule 7", get.rules.rule7(medication.patientMedications));
    saveRecommendation("Rule 8", get.rules.rule8(medication.patientMedications));
    saveRecommendation("Rule 9", get.rules.rule9(medication.patientMedications));
    // saveRecommendation("Rule 10", get.rules.rule10(medication.patientMedications));
    saveRecommendation("Rule 11", get.rules.rule11(medication.patientMedications, medicationData));
  };

  const clearRecommendations = () => {
    onClickClear();
  };

  return (
    <div className="app">
      <div className="app__header">
        <Header />
      </div>
      <div className="app__main">
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
          <Recommendations />

        </div>
      </div>
    </div>
  );
};

App.PropTypes = {
  appendMedicationList: PropTypes.func,
  displayResult: PropTypes.func,
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