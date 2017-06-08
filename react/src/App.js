import React, { Component } from 'react';
import MedicationList from './MedicationList.js';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      patientMedications: '',
      puffValue: '',
      timesPerDayValue: '',
      doseICSValue: '',
      medications: [],
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
     var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
     var medication = {
      id: id,
      name: "",
      price: "",
      category: "",
      qty: 0
    }
    this.state.products.push(medication);
    this.setState(this.state.medications);
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
    this.setState({patientMedications: event.target.value});
  }

  handleSubmit( event ) {
    console.log( this.state.puffValue, " ", this.state.timesPerDayValue ," ", this.state.doseICSValue, " ", this.state.patientMedications);
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>EAAPs Escalation Rules</h2>
        </div>
        <MedicationList onDelEvent={this.handleDeleteRow} onAddEvent={this.handleAddRow} />
      </div>
    );
  }
}



export default App;
