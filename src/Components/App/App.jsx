import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import MedicationList from '../MedicationList/MedicationList.jsx';
import './style.css';

class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      patientMedications: [],
      /*puffValue: '',
      timesPerDayValue: '',
      doseICSValue: '',*/
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
    console.log( "deleteMedication" );

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
    //this.setState({ puffValue: event.target.value });
    this.props.getPuffValue( event.target.value );
    console.log( event.target.value );
    console.log(this.props.puffValue);
    //console.log(this.props.puffValue);
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

  handleSubmit( event ) {
    console.log( this.props.puffValue, " ", this.props.timesPerDayValue ," ", this.props.doseICSValue, " ", this.state.selectMedication );
    event.preventDefault();
  }

  // .header__logo {
  //   img {
  //     border: 2px solid #000;
  //   }
  // }
  //

  render() {
    return (
      <div className="app">
        <div className="app__header">
          <Header />
        </div>
        <MedicationList
          onDelRow={ this.handleDeleteRow }
          onSubmit={ this.handleSubmit }
          onSelection={ this.handleMedicationSelection }
          puffOnChange={ this.handlePuffOnChange }
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
  puffValue: PropTypes.number,
  timesPerDayValue: PropTypes.number,
  doesICSValue: PropTypes.number,
};

export default App;