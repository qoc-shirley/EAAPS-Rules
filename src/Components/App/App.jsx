import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header.jsx';
import MedicationTable from '../MedicationTable/MedicationTable.jsx';
import './styles.css';

class App extends Component {
  constructor( props ) {
    super( props );
    this.onPuffChange = this.onPuffChange.bind( this );
    this.onTimesChange = this.onTimesChange.bind( this );
    this.onDoseICSChange = this.onDoseICSChange.bind( this );
    this.onMedicationSelection = this.onMedicationSelection.bind( this );
    this.onSubmit = this.onSubmit.bind( this );
  }

  onPuffChange( event ) {
    console.log( "Puff" );
    //this.setState({ puffValue: event.target.value });
    this.props.getPuffValue( event.target.value );
    //console.log( "handle puff event: ", event.target.value );
    //console.log( "puff value props:", this.props.puffValue);
  }

  onTimesChange( event ) {
    console.log( "Times" );
    //this.setState({ timesPerDayValue: event.target.value });
    this.props.getTimesPerDayValue( event.target.value );
  }

  onDoseICSChange( event ) {
    console.log( "doseICS" );
    //this.setState({ doseICSValue: event.target.value });
    this.props.getDoseICSValue( event.target.value );
  }

  onMedicationSelection( event ) {
    console.log( "Selection" );
    //this.setState({ selectMedication: event.target.value });
    this.props.getMedicationSelection( event.target.value );
    this.props.getMedicationtoStack();
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
          onSelection={ this.onMedicationSelection }
          puffOnChange={ this.onPuffChange }
          timesOnChange={ this.onTimesChange }
          doseICSOnChange={ this.onDoseICSChange }
          appendMedicationToStack={this.props.appendMedicationToStack}
          stack={this.props.medication.stack}
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