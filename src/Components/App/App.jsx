import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header.jsx';
import MedicationTable from '../MedicationTable/MedicationTable.jsx';
import './styles.css';

class App extends Component {
  constructor( props ) {
    super( props );
    this.onSubmit = this.onSubmit.bind( this );
  }

  onSubmit( event ) {
    console.log( this.props.medication.puffValue, " ", this.props.medication.timesPerDayValue ," ", this.props.medication.doseICSValue, " ", this.props.medication.medicationSelection );
    event.preventDefault();
  }

  render() {
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

        <input className="button__submit" type="submit" value="Submit" onClick={this.onSubmit} />
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