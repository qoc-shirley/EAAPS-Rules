import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import MedicationTable from '../MedicationTable/MedicationTable';
import medicationData from '../MedicationData/MedicationData';
import * as rules from '../Rules/Rules';
import './styles.css';

const App = (
  {
    displayResult,
    medication,
    onMedicationSelection,
    onChangePuffValue,
    onChangeTimesPerDayValue,
    onChangeDoseICS,
    appendMedicationList,
    onDeleteRow,
    getPatientMedications,
    saveRecommendation,
    onClickClear,
  } ) => {

  const onSubmitMedications = (displayMedications) => {
    // displayResult(medication.medicationList);
    getPatientMedications(_.flatten(displayMedications));
  };

  const displayMedications = _
    .chain( medication.medicationList )
    .reduce( (filteredData, medication) => {
      filteredData.push(
        _.chain(medicationData)
          .filter( (masterMedication) => {
            return ((medication.timesPerDayValue === masterMedication.timesPerDay) &&
              (medication.doseICSValue === masterMedication.doseICS) &&
              (medication.availableMedications.chemicalLABA === masterMedication.chemicalLABA) &&
              (medication.availableMedications.chemicalICS === masterMedication.chemicalICS) &&
              (medication.availableMedications.chemicalOther === masterMedication.chemicalOther))
          })
        .value()
      );
      return filteredData;
    }, [])
    .value();

  // need to display recommendations: all? or only some fields?
  const onClickRule = ( rule ) => {
    if(rule === 'rule1') {
      saveRecommendation(rule, rules.rule1(medication.patientMedications));
    }
    else if(rule === 'rule2') {
      saveRecommendation(rule, rules.rule2(medication.patientMedications, medicationData));
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
          <fieldset className="patientMedications">
            <legend>Filtered Medications:</legend>
            {
              displayMedications.map(
                (row, rowIndex) => {
                  return (
                    <div key={rowIndex}>
                      <p>{rowIndex}:</p>
                      {
                        row.map(
                          (medication, index) => (
                            <p key={index}>id: {medication.id}</p>
                          )
                        )
                      }
                    </div>
                  );
                }
              )
            }
          </fieldset>

          <div className="button">
            <input
              className="submit"
              type="submit"
              value="Submit Filtered Medications"
              onClick={() => onSubmitMedications(displayMedications)}
            />
          </div>

          <div className="rules">
            <p>Available Escalation Rules</p>
            <div className="buttons">
              <input
                type="submit"
                value="Rule1"
                onClick={() => onClickRule("rule1")}
              />
              <input
                type="submit"
                value="Rule2"
                onClick={() => onClickRule("rule2")}
              />
              <input
                type="submit"
                value="Rule6"
                onClick={() => onClickRule("rule6")}
              />
              <input
                type="submit"
                value="Rule8"
                onClick={() => onClickRule("rule8")}
              />
              <input
                type="submit"
                value="Rule10"
                onClick={() => onClickRule("rule10")}
              />
              <input
                type="submit"
                value="Rule11"
                onClick={() => onClickRule("rule11")}
              />
            </div>
          </div>
          <fieldset className="patientMedications">
            <legend>Recommendation(s):</legend>
            {
              medication.recommendation.map(
                (recommendMedication, index) => {
                  if (_.isArray(recommendMedication)) {
                    return (
                      <div key={index}>
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
                      <div key={index}>
                        {
                          recommendMedication.map(
                            (medication, index) => {
                              return (
                                <div key={index}>
                                  <p>id: {medication.id}</p>
                                  <p>device: {medication.device}</p>
                                  <p>function: {medication.function}</p>
                                  <p>name: {medication.name}</p>
                                  <p>type: {medication.type}</p>
                                  <p>chemical type: {medication.chemicalType}</p>
                                  <p>chemicalLABA: {medication.chemicalLABA}</p>
                                  <p>chemicalICS: {medication.chemicalICS}</p>
                                  <p>chemicalOther: {medication.chemicalOther}</p>
                                  <p>dose ics: {medication.doseICS}</p>
                                  <p>max green ics: {medication.maxGreenICS}</p>
                                  <p>times per day: {medication.timesPerDay}</p>
                                  <p>max puff per time: {medication.maxPuffPerTime}</p>
                              </div>
                              );
                            }
                          )
                        }
                      </div>
                    )
                  }
                }
              )
            }
            <input
              type="submit"
              value="Clear"
              onClick={clearRecommendations}
            />
          </fieldset>
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