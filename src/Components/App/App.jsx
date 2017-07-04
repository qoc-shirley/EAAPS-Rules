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
          <div className="patientMedications">
            <h3>Your Medications:</h3>
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
            <input
              className="submit"
              type="submit"
              value="Submit Filtered Medications"
              onClick={() => onSubmitMedications(displayMedications)}
            />
          </div>

          <div className="rules">
            <h3>Available Escalation Rules</h3>
            <div className="buttons">
              <input
                className="rulesButtons"
                type="submit"
                value="Rule1"
                onClick={() => onClickRule("rule1")}
              />
              <input
                className="rulesButtons"
                type="submit"
                value="Rule2"
                onClick={() => onClickRule("rule2")}
              />
              <input
                className="rulesButtons"
                type="submit"
                value="Rule4"
                onClick={() => onClickRule("rule4")}
              />
              <input
                className="rulesButtons"
                type="submit"
                value="Rule6"
                onClick={() => onClickRule("rule6")}
              />
              <input
                className="rulesButtons"
                type="submit"
                value="Rule8"
                onClick={() => onClickRule("rule8")}
              />
              <input
                className="rulesButtons"
                type="submit"
                value="Rule10"
                onClick={() => onClickRule("rule10")}
              />
              <input
                className="rulesButtons"
                type="submit"
                value="Rule11"
                onClick={() => onClickRule("rule11")}
              />
            </div>
          </div>
          <div className="recommendations">
            <h4>Recommendation(s):</h4>
            {
              medication.recommendation.map(
                (recommendMedication, index) => {
                  if (_.isArray(recommendMedication)) {
                    return (
                      <div key={index} className="recommendationArray">
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