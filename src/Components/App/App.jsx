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
                      <p><b>{index + 1}</b></p>
                      <p className="data">ID: {recommendMedication[0]}</p>
                      <p className="data">Device: {recommendMedication[5]}</p>
                      <p className="data">Name: {recommendMedication[7]}</p>
                      <p className="data">ChemicalLABA: {recommendMedication[10]}</p>
                      <p className="data">ChemicalICS: {recommendMedication[11]}</p>
                      <p className="data">Dose ICS: {recommendMedication[14]}</p>
                      <p className="data">Times Per Day: {recommendMedication[22]}</p>
                      <p className="data">Max Puff Per Time: {recommendMedication[23]}</p>
                    </div>
                  )
                }
                else if(_.isArray(recommendMedication)) {
                  return (
                    <div key={index} className="recommendationArray">
                      <p><b>{index + 1}</b></p>
                      {
                        recommendMedication.map(
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
                  )
                }
                else {
                  return (
                    <div key={index} className="recommendationObject">
                      <p><b>{index + 1}</b></p>
                      <p className="data">ID: {recommendMedication.id}</p>
                      <p className="data">Device: {recommendMedication.device}</p>
                      <p className="data">Name: {recommendMedication.name}</p>
                      <p className="data">ChemicalLABA: {recommendMedication.chemicalLABA}</p>
                      <p className="data">ChemicalICS: {recommendMedication.chemicalICS}</p>
                      <p className="data">Dose ICS: {recommendMedication.doseICS}</p>
                      <p className="data">Times Per Day: {recommendMedication.timesPerDay}</p>
                      <p className="data">Max Puff Per Time: {recommendMedication.maxPuffPerTime}</p>
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

  const availableRules = ['rule1', 'rule2', 'rule4', 'rule7', 'rule8', 'rule9', 'rule11'];

  const onChangeRule = ( rule ) => {
    if(rule === 'rule1') {
      saveRecommendation(rule, rules.rule1(medication.patientMedications));
    }
    else if(rule === 'rule2') {
      saveRecommendation(rule, rules.rule2(medication.patientMedications, medicationData));
    }
    else if(rule === 'rule4') {
      saveRecommendation(rule, _.flatten(rules.rule4(medication.patientMedications, medicationData)));
    }
    else if(rule === 'rule6') {
      saveRecommendation(rule, rules.rule6(medication.patientMedications));
    }
    else if(rule === 'rule7') {
      saveRecommendation(rule, rules.rule7(medication.patientMedications));
    }
    else if(rule === 'rule8') {
      saveRecommendation(rule, rules.rule8(medication.patientMedications));
    }
    else if(rule === 'rule9') {
      saveRecommendation(rule, rules.rule9(medication.patientMedications));
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