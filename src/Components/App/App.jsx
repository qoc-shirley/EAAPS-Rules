import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header.jsx';
import MedicationTable from '../MedicationTable/MedicationTable.jsx';
import './styles.css';

class App extends Component {
  render() {

    const onSubmitMedications = () => {
      this.props.displayResult(this.props.medication.medicationList);
    };

    return (
      <div className="app">
        <div className="app__header">
          <Header />
        </div>
        <MedicationTable
          onSubmitMedications={ this.onSubmitMedications }
          onChangeMedication={ this.props.onMedicationSelection }
          onChangePuffValue={ this.props.onPuffChange }
          onChangeTimesPerDayValue={ this.props.onTimesChange }
          onChangeDoseICS={ this.props.onDoseICSChange }
          appendMedicationList={this.props.appendMedicationList}
          medicationList={this.props.medication.medicationList}
          onClickDeleteMedication={this.props.onDeleteRow}
        />
        <div className="button">
          <input className="submit" type="submit" value="Submit" onClick={ onSubmitMedications } />
        </div>

        <div className="results">
          <p>Your Medication(s): </p>
          {this.props.medication.results.map( (row, index) => (
            <div key={index}>
              <p>{index}: </p>
              <p>Puff Value: {row.puffValue}</p>
              <p>Times Per Day: {row.timesPerDayValue}</p>
              <p>Dose ICS: {row.doseICSValue}</p>
              <p>Medication: {row.availableMedications}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

App.PropTypes = {
  getPuffValue: PropTypes.func.isRequired,
  getTimesPerDayValue: PropTypes.func.isRequired,
  getDoseICSValue: PropTypes.func.isRequired,
  getMedicationSelection: PropTypes.func.isRequired,
};

App.defaultProps = {
  // missing prop declarations
};
export default App;