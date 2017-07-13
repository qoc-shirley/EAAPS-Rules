import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import MedicationTable from '../MedicationTable/MedicationTable';
import medicationData from '../MedicationData/MedicationData';
import DisplayPatientMedications from '../DisplayMedications/DisplayMedications';
import * as rules from '../Rules/Rules';
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
    saveRecommendation("Rule -1", rules.ruleMinus1(medication.patientMedications));
    saveRecommendation("Rule 0", rules.rule0(medication.patientMedications, medicationData));
    // saveRecommendation("Rule 1", rules.rule1(medication.patientMedications, medicationData));
    // saveRecommendation("Rule 3", rules.rule3(medication.patientMedications, medicationData));
    saveRecommendation("Rule 4", _.flatten(rules.rule4(medication.patientMedications, medicationData)));
    // saveRecommendation("Rule 5", rules.rule5(medication.patientMedications, medicationData));
    //saveRecommendation("Rule 6", rules.rule6(medication.patientMedications));
    saveRecommendation("Rule 7", rules.rule7(medication.patientMedications));
    saveRecommendation("Rule 8", rules.rule8(medication.patientMedications));
    saveRecommendation("Rule 9", rules.rule9(medication.patientMedications));
    //saveRecommendation("Rule 10", rules.rule10(medication.patientMedications));
    saveRecommendation("Rule 11", rules.rule11(medication.patientMedications, medicationData));
  };

  const showRecommendations = () => {
    if (medication.isRuleSelectEmpty === false) {
      return (
        <div className="recommendations">
          <h4>Recommendation(s):</h4>
          {
            medication.recommendation.map(
              (recommendMedication, index) => {
                let noRecommendation = null;
                if (_.isEmpty(recommendMedication.medications)) {
                  noRecommendation = <p>No recommendations</p>
                }
                return (
                  <div key={index}>
                    <p><b>{recommendMedication.rule}</b></p>
                    {noRecommendation}
                    {
                      recommendMedication.medications.map(
                        (medicationElement, medicationIndex) => {
                          console.log("is it empty: ", _.isEmpty(medicationElement));
                          if (_.isArray(medicationElement) && _.size(medicationElement) > 29) {
                            return (
                              <div key={medicationIndex} className="recommendationArray">
                                <p><b>-</b></p>
                                <p className="data">ID: {medicationElement[0]}</p>
                                <p className="data">Device: {medicationElement[5]}</p>
                                <p className="data">Name: {medicationElement[7]}</p>
                                <p className="data">ChemicalLABA: {medicationElement[10]}</p>
                                <p className="data">ChemicalICS: {medicationElement[11]}</p>
                                <p className="data">Dose ICS: {medicationElement[14]}</p>
                                <p className="data">Times Per Day: {medicationElement[22]}</p>
                                <p className="data">Max Puff Per Time: {medicationElement[23]}</p>
                              </div>
                            );
                          }
                          else if (_.isArray(medicationElement) && _.size(medicationElement) < 29) {
                            return (
                              <div key={medicationIndex} className="recommendationArray">
                                <p><b>-</b></p>
                                {
                                  medicationElement.medications.map(
                                    (medication, index) => {
                                      return (
                                        <p key={index}
                                           className="data"
                                        >
                                          {medication}
                                        </p>
                                      );
                                    }
                                  )
                                }
                              </div>
                            );
                          }
                          else if (!_.isArray(medicationElement) && _.size(medicationElement) < 29) {
                            return (
                              <div key={medicationIndex} className="recommendationArray">
                                <p><b>-</b></p>
                                {
                                  recommendMedication.medications.map(
                                    (medication, index) => {
                                      return (
                                        <p key={index}
                                           className="data"
                                        >
                                          {medication}
                                        </p>
                                      );
                                    }
                                  )
                                }
                              </div>
                            );
                          }
                          else if (!_.isArray(medicationElement) && _.size(medicationElement) > 29) {
                            return (
                              <div key={medicationIndex} className="recommendationObject">
                                <p><b>-</b></p>
                                <p className="data">ID: {medicationElement.id}</p>
                                <p className="data">Device: {medicationElement.device}</p>
                                <p className="data">Name: {medicationElement.name}</p>
                                <p className="data">ChemicalLABA: {medicationElement.chemicalLABA}</p>
                                <p className="data">ChemicalICS: {medicationElement.chemicalICS}</p>
                                <p className="data">Dose ICS: {medicationElement.doseICS}</p>
                                <p className="data">Times Per Day: {medicationElement.timesPerDay}</p>
                                <p className="data">Max Puff Per
                                  Time: {medicationElement.maxPuffPerTime}</p>
                              </div>
                            );
                          }
                        }
                      )
                    }
                  </div>
                )
              }
          )
          }
          < input
            className="clear"
            type="submit"
            value="Clear"
            onClick={clearRecommendations}
          />
        </div>
      );
    }
    else if (medication.isRuleSelectEmpty === true) {
      return null;
    }
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
          {showRecommendations()}
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