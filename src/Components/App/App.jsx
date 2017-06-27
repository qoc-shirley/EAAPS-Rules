import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import MedicationTable from '../MedicationTable/MedicationTable';
import medicationData from '../MedicationData/MedicationData';
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
    onDeleteRow
  } ) => {

  const onSubmitMedications = () => {
    displayResult(medication.medicationList);
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
      <div className="button">
        <input className="submit" type="submit" value="Submit" onClick={onSubmitMedications} />
      </div>

      <div className="results">
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
      </div>
      <div>
        <p>Filtered Medications:</p>
        {
          displayMedications.map(
            (row) => {
              return row.map(
                ( medication, index ) => (
                  <p key={index}>id: {medication.id}</p>
                )
              );
            }
          )
        }
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