import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header.jsx';
import MedicationTable from '../MedicationTable/MedicationTable.jsx';
import './styles.css';

class App extends Component {
  render() {

    console.log("results: ", this.props.medication.result);

    const onSubmit = () => {
      this.props.displayResult("display results");
      return(
        <div className="results">
          <p>Your Medication(s): </p>
         {this.props.medication.result}
        </div>
      );
    };

    return (
      <div className="app">
        <div className="app__header">
          <Header />
        </div>
        <MedicationTable
          onSubmit={ this.onSubmit }
          onMedicationSelection={ this.props.onMedicationSelection }
          puffOnChange={ this.props.onPuffChange }
          timesOnChange={ this.props.onTimesChange }
          doseICSOnChange={ this.props.onDoseICSChange }
          appendMedicationToStack={this.props.appendMedicationToStack}
          stack={this.props.medication.stack}
          onDeleteRow={this.props.onDeleteRow}
        />

        <input className="button__submit" type="submit" value="Submit" onClick={ onSubmit } />
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