import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import MedicationList from '../MedicationList/MedicationList.jsx';
import './styles.css';

class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      patientMedications: [],
      selectMedication: '',
    };
    this.onDeleteRow = this.onDeleteRow.bind( this );
    this.onAddRow = this.onAddRow.bind( this );
    this.onPuffChange = this.onPuffChange.bind( this );
    this.handleTimesOnChange = this.handleTimesOnChange.bind( this );
    this.handleDoseICSOnChange = this.handleDoseICSOnChange.bind( this );
    this.handleMedicationSelection = this.handleMedicationSelection.bind( this );
    this.onSubmit = this.onSubmit.bind( this );
  }

  onAddRow( newMedication ) {
    console.log( "addRow" );
  }

  onDeleteRow( medication ) {
    console.log("deleteMedication");
  }

  onPuffChange( event ) {
    console.log( "Puff" );
    //this.setState({ puffValue: event.target.value });
    this.props.getPuffValue( event.target.value );
    //console.log( "handle puff event: ", event.target.value );
    //console.log( "puff value props:", this.props.puffValue);
  }

  handleTimesOnChange( event ) {
    console.log( "Times" );
    //this.setState({ timesPerDayValue: event.target.value });
    this.props.getTimesPerDayValue( event.target.value );
  }

  handleDoseICSOnChange( event ) {
    console.log( "doseICS" );
    //this.setState({ doseICSValue: event.target.value });
    this.props.getDoseICSValue( event.target.value );
  }

  handleMedicationSelection( event ) {
    console.log( "Selection" );
    this.setState({ selectMedication: event.target.value });
  }

  onSubmit( event ) {
    console.log( this.props.puffValue, " ", this.props.timesPerDayValue ," ", this.props.doseICSValue, " ", this.state.selectMedication );
    event.preventDefault();
  }

  render() {
    return (
      <div className="app">
        <div className="app__header">
          {Header}
        </div>
        <MedicationList
          onDelRow={ this.onDeleteRow }
          onSubmit={ this.onSubmit }
          onSelection={ this.handleMedicationSelection }
          puffOnChange={ this.onPuffChange }
          timesOnChange={ this.handleTimesOnChange }
          doseICSOnChange={ this.handleDoseICSOnChange }
        />
        <button className="body__button--add" onClick={this.handleAddRow}>Add Row</button>
        <input className="body__button--submit" type="submit" value="Submit" onClick={this.handleSubmit} />
      </div>
    );
  }
}

App.PropTypes = {
  getPuffValue: PropTypes.func.isRequired,
  getTimesPerDayValue: PropTypes.func.isRequired,
  getDoseICSValue: PropTypes.func.isRequired,
};

export default App;