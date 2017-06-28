import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import MedicationTable from '../MedicationTable/MedicationTable';
import medicationData from '../MedicationData/MedicationData';
// import * as rule from '../Rules/Rules';
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

  const checkboxHandler = ( rule ) => {
    if(rule === 'rule1') {
      console.log("rule1");
      rule.rule1(medication.patientMedications);

    }
    else if(rule === 'rule2') {
      console.log("rule2");
    }
    else if(rule === 'rule6') {
      console.log("rule6");
    }
    else if(rule === 'rule8') {
      console.log("rule8");
    }
    else if(rule === "rule10") {
      console.log("rule10");
    }
    else if(rule === 'rule11') {
      console.log('rule11');
    }
  };

  return (
    <div className="app">
      <div className="app__header">
        <Header />
      </div>
      <MedicationTable
        onChangeMedication={onMedicationSelection}
        onChangePuffValue={onChangePuffValue}
        onChangeTimesPerDayValue={onChangeTimesPerDayValue}
        onChangeDoseICS={onChangeDoseICS}
        appendMedicationList={appendMedicationList}
        medicationList={medication.medicationList}
        onClickDeleteMedication={onDeleteRow}
      />

      {/*<div className="results">
        <p>Your Medication(s): </p>
        {
          medication.results.map(
            (row, index) => (
              <div key={index}>
                <p>{index}: </p>
                <p>Puff Value: {row.puffValue}</p>
                <p>Times Per Day: {row.timesPerDayValue}</p>
                <p>Dose ICS: {row.doseICSValue}</p>
                <p>Medication: </p>
                <p>ChemicalLABA: {row.availableMedications.chemicalLABA}</p>
                <p>ChemicalICS: {row.availableMedications.chemicalICS}</p>
                <p>ChemicalOther: {row.availableMedications.chemicalOther}</p>
              </div>
            )
          )
        }
      </div>*/}
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

        <fieldset className="rules">
          <legend>Available Escalation Rules</legend>
          <div className="checkbox">
            <input
              type="checkbox"
              name="Rule1"
              onClick={() => checkboxHandler("rule1")}
            />
            <label>Rule1</label>
          </div>
          <div className="checkbox">
            <input
              type="checkbox"
              name="Rule2"
              onClick={() => checkboxHandler("rule2")}
            />
            <label>Rule2</label>
          </div>
          <div className="checkbox">
            <input
              type="checkbox"
              name="Rule6"
              onClick={() => checkboxHandler("rule6")}
            />
            <label>Rule6</label>
          </div>
          <div className="checkbox">
            <input
              type="checkbox"
              name="Rule8"
              onClick={() => checkboxHandler("rule8")}
            />
            <label>Rule8</label>
          </div>
          <div className="checkbox">
            <input
              type="checkbox"
              name="Rule10"
              onClick={() => checkboxHandler("rule10")}
            />
            <label>Rule10</label>
          </div>
          <div className="checkbox">
            <input
              type="checkbox"
              name="Rule11"
              onClick={() => checkboxHandler("rule11")}
            />
            <label>Rule11</label>
          </div>
        </fieldset>
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
};

App.defaultProps = {
  medicationList: [],
};
export default App;