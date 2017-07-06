import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import MedicationTable from '../MedicationTable/MedicationTable';
import medicationData from '../MedicationData/MedicationData';
// import Row from '../Row/Row';
import DisplayPatientMedications from '../DisplayMedications/DisplayMedications';
import * as rules from '../Rules/Rules';
import './styles.css';

const App = (
  {
    appendMedicationList,
    // getPatientMedications,
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
  console.log(medication.isRecommendationEmpty);
  if(medication.isRecommendationEmpty === false){
    showPatientMedications = <DisplayPatientMedications />;
  }
  else if(medication.isRecommendationEmpty === true) {
    showPatientMedications = null;
  }

  const showAvailableRules = () => {
    if(medication.isRecommendationEmpty === false) {
      return (
        <div className="rules">
          <h3>Available Escalation Rules:
            <select
              className="selectRule"
              onChange={(event) => onChangeRule(event.target.value)}
              defaultValue={"Select a rule"}
            >
              <option>Select a rule</option>
              {
                availableRules.map(
                  (rule, index) => (
                    <option key={index}>{rule}</option>
                  ))}
            </select>
          </h3>
        </div>
      );
    }
    else if(medication.isRecommendationEmpty === true) {
      return null;
    }
  };

  const showRecommendations = () => {
    if(medication.isRuleSelectEmpty === false) {
      return (
        <div className="recommendations">
          <h4>Recommendation(s):</h4>
          {
            medication.recommendation.map(
              (recommendMedication, index) => {
                if (_.isArray(recommendMedication) && _.size(recommendMedication) > 10) {
                  return (
                    <div key={index} className="recommendationArray">
                      <p><b>Recommendation {index + 1}</b></p>
                      <p>Device: {recommendMedication[5]}</p>
                      <p>Name: {recommendMedication[7]}</p>
                      <p>ChemicalLABA: {recommendMedication[10]}</p>
                      <p>ChemicalICS: {recommendMedication[11]}</p>
                      <p>Dose ICS: {recommendMedication[14]}</p>
                      <p>Times Per Day: {recommendMedication[22]}</p>
                      <p>Max Puff Per Time: {recommendMedication[23]}</p>
                    </div>
                  )
                }
                else if(_.isArray(recommendMedication)) {
                  return (
                    <div key={index} className="recommendationArray">
                      <p><b>Recommendation {index + 1}</b></p>
                      {
                        recommendMedication.map(
                          (medication, index) => {
                            return (
                              <p key={index}>{medication}</p>
                            );
                          }
                        )
                      }
                    </div>
                  )
                }
                else {
                  return (
                    <div key={index} className="recommendationObject">
                      <p><b>Recommendation {index + 1}</b></p>
                      <p>Device: {recommendMedication.device}</p>
                      <p>Name: {recommendMedication.name}</p>
                      <p>ChemicalLABA: {recommendMedication.chemicalLABA}</p>
                      <p>ChemicalICS: {recommendMedication.chemicalICS}</p>
                      <p>Dose ICS: {recommendMedication.doseICS}</p>
                      <p>Times Per Day: {recommendMedication.timesPerDay}</p>
                      <p>Max Puff Per Time: {recommendMedication.maxPuffPerTime}</p>
                    </div>
                  )
                }
              }
            )
          }
          <input
            className="clear"
            type="submit"
            value="Clear"
            onClick={clearRecommendations}
          />
        </div>
      );
    }
    else if(medication.isRuleSelectEmpty === true) {
      return null;
    }
  };

  const availableRules = ['rule1', 'rule2', 'rule3', 'rule6', 'rule8', 'rule10'];

  // need to display recommendations: all? or only some fields?
  const onChangeRule = ( rule ) => {
    if(rule === 'rule1') {
      saveRecommendation(rule, rules.rule1(medication.patientMedications));
    }
    else if(rule === 'rule2') {
      saveRecommendation(rule, rules.rule2(medication.patientMedications, medicationData));
    }
    else if(rule === 'rule4') {
      saveRecommendation(rule, rules.rule4(medication.patientMedications, medicationData));
    }
    else if(rule === 'rule6') {
      saveRecommendation(rule, rules.rule6(medication.patientMedications));
    }
    else if(rule === 'rule8') {
      saveRecommendation(rule, rules.rule8(medication.patientMedications));
    }
    else if(rule === "rule10") {
      saveRecommendation(rule, rules.rule10(medication.patientMedications));
    }
    else if(rule === 'rule11') {
      saveRecommendation(rule, rules.rule11(medication.patientMedications, medicationData));
    }
    else{
      console.log("nope");
    }
  };

  const clearRecommendations = ( ) => {
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