import React, { Component } from 'react';
import MedicationList from '../MedicationList/MedicationList.jsx';
import logo from './img/logo.svg';
import './App.css';

class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      patientMedications: [],
      puffValue: '',
      timesPerDayValue: '',
      doseICSValue: '',
      selectMedication: '',
    };
    this.handleDeleteRow = this.handleDeleteRow.bind( this );
    this.handleAddRow = this.handleAddRow.bind( this );
    this.handlePuffOnChange = this.handlePuffOnChange.bind( this );
    this.handleTimesOnChange = this.handleTimesOnChange.bind( this );
    this.handleDoseICSOnChange = this.handleDoseICSOnChange.bind( this );
    this.handleMedicationSelection = this.handleMedicationSelection.bind( this );
    this.handleSubmit = this.handleSubmit.bind( this );
  }

  handleAddRow( newMedication ) {
    console.log( "addRow", newMedication );

    /*
     let medication = {
      puffValue: '',
      timesPerDayValue: '',
      doseICSValue: '',
      selectMedication: '',
    }
    let addMedication = this.state.patientMedications.concat(medication);
    this.setState({patientMedications: addMedication});
    */
  }

  handleDeleteRow( medication ) {
    console.log( "deleteMedication", medication );

    /*
      let index = this.state.medications.indexOf(medication);
      this.state.products.splice(index, 1);
      this.setState(this.state.medications);
    */
  }

  
  /*handleMedicationList( event ) {
    let patientMedication = {
      puffValue: event.target.puffValue,
      timesPerDayValue: event.target.timesPerDayValue,
      doseICSValue: event.target.doseICSValue,
      selectMedication: event.target.selectMedication
    };
    let medications = this.state.patientMedications;

    let newMedications = medications.map( (medication) => {
      for ( let key in medication ) {
        if ( key === patientMedication.puffValue ) {
          medication[key] = patientMedication.puffValue;
        }
        else if( key === patientMedication.timesPerDayValue ) {
          medication[key] = patientMedication.timesPerDayValue;
        }
        else if( key === patientMedication.doseICSValue ) {
          medication[key] = patientMedication.doseICSValue;
        }
        else if( key === patientMedication.selectMedication ) {
          medication[key] = patientMedication.selectMedication;
        }
      }
      return medication;
    });
    this.setState({patientMedications: newMedications});
    console.log(this.state.patientMedications);
  };*/
  

  handlePuffOnChange( event ) {
    console.log( "Puff" );
    this.setState({ puffValue: event.target.value });
  }

  handleTimesOnChange( event ) {
    console.log( "Times" );
    this.setState({ timesPerDayValue: event.target.value });
  }

  handleDoseICSOnChange( event ) {
    console.log( "doseICS" );
    this.setState({ doseICSValue: event.target.value });
  }

  handleMedicationSelection( event ) {
    console.log( "Selection" );
    this.setState({ selectMedication: event.target.value });
  }

  handleSubmit( event ) {
    console.log( this.state.puffValue, " ", this.state.timesPerDayValue ," ", this.state.doseICSValue, " ", this.state.selectMedication );
    event.preventDefault();
  }

  render() {
    return (
      <div className="app">
        <div className="app__header">
          <img src={logo} className="header__logo" alt="logo" />
          <h2>EAAPs Escalation Rules</h2>
        </div>
        <MedicationList
          onDelRow={ this.handleDeleteRow }
          onAddRow={ this.handleAddRow }
          onSubmit={ this.handleSubmit }
          onSelection={ this.handleMedicationSelection }
          puffOnChange={ this.handlePuffOnChange }
          timesOnChange={ this.handleTimesOnChange }
          doseICSOnChange={ this.handleDoseICSOnChange }
          puffValue={ this.state.puffValue }
          timesPerDayValue={ this.state.timesPerDayValue }
          doseICSValue={ this.state.doseICSValue }
        />
      </div>
    );
  }
}

export default App;
