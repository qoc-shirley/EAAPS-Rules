import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header';
import MedicationList from '../MedicationList/MedicationList.jsx';
import './styles.css';

class App extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      selectMedication: '',
    };
    this.onDeleteRow = this.onDeleteRow.bind( this );
    this.onAddRow = this.onAddRow.bind( this );
    this.onPuffChange = this.onPuffChange.bind( this );
    this.onTimesChange = this.onTimesChange.bind( this );
    this.onDoseICSChange = this.onDoseICSChange.bind( this );
    this.onMedicationSelection = this.onMedicationSelection.bind( this );
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
    this.setState({ selectMedication: event.target.value });
  }

  onSubmit( event ) {
    console.log( this.props.medication.puffValue, " ", this.props.medication.timesPerDayValue ," ", this.props.medication.doseICSValue, " ", this.state.selectMedication );
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
          onSelection={ this.onMedicationSelection }
          puffOnChange={ this.onPuffChange }
          timesOnChange={ this.onTimesChange }
          doseICSOnChange={ this.onDoseICSChange }
        />
        <button className="body__button--add" onClick={this.onAddRow}>Add Row</button>
        <input className="body__button--submit" type="submit" value="Submit" onClick={this.onSubmit} />
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