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
          <button
            className="button__deleteRow"
            onClick={() => onChangeRule()}
          >
            Run Rules
          </button>
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
                if (_.isArray(recommendMedication) && _.size(recommendMedication) > 29) {
                  console.log("1");
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
                else if(_.isArray(recommendMedication) && _.size(recommendMedication) < 29) {
                  console.log("2");
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
                  );
                }
                else if(!_.isArray(recommendMedication) && _.size(recommendMedication) < 29) {
                  console.log("4");
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
                  );
                }
                else if(!_.isArray(recommendMedication) && _.size(recommendMedication) > 29){
                  console.log("3");
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

  const availableRules = ['rule1', 'rule2', 'rule3', 'rule4', 'rule7', 'rule8', 'rule9', 'rule11'];

  const onChangeRule = () => {
    saveRecommendation("Rule -1", rules.ruleMinus1(medication.patientMedications));
    saveRecommendation("Rule 0", rules.rule0(medication.patientMedications, medicationData));
    saveRecommendation("Rule 1", rules.rule1(medication.patientMedications, medicationData));
    saveRecommendation("Rule 3", rules.rule3(medication.patientMedications, medicationData));
    saveRecommendation("Rule 4", _.flatten(rules.rule4(medication.patientMedications, medicationData)));
    saveRecommendation("Rule 5", rules.rule5(medication.patientMedications, medicationData));
    saveRecommendation("Rule 6", rules.rule6(medication.patientMedications));
    saveRecommendation("Rule 7", rules.rule7(medication.patientMedications));
    saveRecommendation("Rule 8", rules.rule8(medication.patientMedications));
    saveRecommendation("Rule 9", rules.rule9(medication.patientMedications));
    saveRecommendation("Rule 10", rules.rule10(medication.patientMedications));
    saveRecommendation("Rule 11", rules.rule11(medication.patientMedications, medicationData));
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