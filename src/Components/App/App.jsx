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
    console.log("delete DisplayPatientMedications");
    showPatientMedications = null;
  }

  const availableRules = ['rule1', 'rule2', 'rule3', 'rule6', 'rule8', 'rule10'];

  const displayMedications = _
    .chain( medication.medicationList )
    .reduce( (filteredData, medication) => {
      filteredData.push(
        _.chain(medicationData)
          .filter((masterMedication) => {
            return (
              (
                medication.timesPerDayValue === masterMedication.timesPerDay ||
                (medication.timesPerDayValue === "" && masterMedication.timesPerDay === ".")
              ) &&
              (
                medication.doseICSValue === masterMedication.doseICS ||
                medication.doseICSValue === "" && masterMedication.doseICS === "."
              ) &&
              (
                medication.chemicalLABA === masterMedication.chemicalLABA ||
                (medication.chemicalLABA === "chemicalLABA" || medication.chemicalLABA === "") &&
                masterMedication.chemicalLABA === "."
              ) &&
              (
                medication.chemicalICS === masterMedication.chemicalICS ||
                (medication.chemicalICS === "chemicalICS" || medication.chemicalICS === "") &&
                masterMedication.chemicalICS === "."
              ) &&
              (medication.medicationName === masterMedication.name) &&
              (medication.deviceName === masterMedication.device)
            )
          })
        .value()
      );
      return filteredData;
    }, [])
    .value();

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
          {/*<div className="patientMedications">
            <h3>Your Medications:</h3>
            {
              displayMedications.map(
                (row, rowIndex) => {
                  return (
                    <div key={rowIndex} className="medicationRow">
                      {
                        row.map(
                          (patientMedication, index) => {
                            return (
                              <div key={index} className="filteredMedications">
                                <p className="medication">Medication {rowIndex + 1}</p>
                                <p>Device: {patientMedication.device}</p>
                                <p>Name: {patientMedication.name}</p>
                                <p>chemicalLABA: {patientMedication.chemicalLABA}</p>
                                <p>chemicalICS: {patientMedication.chemicalICS}</p>
                                <p>Dose ICS:{patientMedication.doseICS}</p>
                                <p>Max Puff: {patientMedication.maxPuffPerTime}</p>
                                <p>Times Per Day: {patientMedication.timesPerDay}</p>
                              </div>
                            );
                          }
                        )
                      }
                    </div>
                  );
                }
              )
            }
          </div>*/}

          <div className="rules">
            <h3>Available Escalation Rules:
            <select
              className="selectRule"
              onChange={(event) => onChangeRule( event.target.value )}
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
          <div className="recommendations">
            <h4>Recommendation(s):</h4>
            {
              medication.recommendation.map(
                (recommendMedication, index) => {
                  if (_.isArray(recommendMedication)) {
                    return (
                      <div key={index} className="recommendationArray">
                        <p>medication {index + 1}:</p>
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
                        <p>medication {index + 1}:</p>
                        <p>id: {recommendMedication.id}</p>
                        <p> device: {recommendMedication.device}</p>
                        <p>function: {recommendMedication.function}</p>
                        <p>name: {recommendMedication.name}</p>
                        <p>type: {recommendMedication.type}</p>
                        <p>chemical type: {recommendMedication.chemicalType}</p>
                        <p>chemicalLABA: {recommendMedication.chemicalLABA}</p>
                        <p>chemicalICS: {recommendMedication.chemicalICS}</p>
                        <p>chemicalOther: {recommendMedication.chemicalOther}</p>
                        <p>dose ics: {recommendMedication.doseICS}</p>
                        <p>max green ics: {recommendMedication.maxGreenICS}</p>
                        <p>times per day: {recommendMedication.timesPerDay}</p>
                        <p>max puff per time: {recommendMedication.maxPuffPerTime}</p>
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