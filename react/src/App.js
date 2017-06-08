import React, { Component } from 'react';
import MedicationList from './MedicationList.js';
import logo from './logo.svg';
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
    console.log( "addRow" );
    /*
     var medication = {
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
    console.log( "deleteMedication" );
    /*
      var index = this.state.medications.indexOf(medication);
      this.state.products.splice(index, 1);
      this.setState(this.state.medications);
    */
  }

  /*
  handleProductTable(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
    var medications = this.state.medications;

    var newProducts = medications.map(function(product) {
      for (var key in product) {
        if (key == item.name && product.id == item.id) {
          product[key] = item.value;

        }
      }
      return product;
    });
    this.setState(newProducts);
    console.log(this.state.medications);
  };
  */

  handlePuffOnChange( event ) {
    console.log( "Puff");
    this.setState({puffValue: event.target.value});
  }

  handleTimesOnChange( event ) {
    console.log( "Times");
    this.setState({timesPerDayValue: event.target.value});
  }

  handleDoseICSOnChange( event ) {
    console.log( "doseICS" );
    this.setState({doseICSValue: event.target.value});
  }

  handleMedicationSelection( event ){
    console.log( "Selection" );
    this.setState({selectMedication: event.target.value});
  }

  handleSubmit( event ) {
    console.log( this.state.puffValue, " ", this.state.timesPerDayValue ," ", this.state.doseICSValue, " ", this.state.selectMedication);
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>EAAPs Escalation Rules</h2>
        </div>

        <MedicationList 
          onDelEvent={this.handleDeleteRow} 
          onAddEvent={this.handleAddRow} 
          onSubmit={this.handleSubmit} 
          onSelection={this.handleMedicationSelection}
          puffOnChange={this.handlePuffOnChange}
          timesOnChange={this.handleTimesOnChange}
          doseICSOnChange={this.handleDoseICSOnChange}
          puffValue={this.state.puffValue}
          timesPerDayValue={this.state.timesPerDayValue}
          doseICSValue={this.state.doseICSValue}
        />
      </div>
    );
  }
}



export default App;
