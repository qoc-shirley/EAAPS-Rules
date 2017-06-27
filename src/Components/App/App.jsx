import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header.jsx';
import MedicationTable from '../MedicationTable/MedicationTable.jsx';
import _ from 'lodash';
import medicationData from '../MedicationData.js';
import './styles.css';

class App extends Component {
  render() {

    // let getMedicationColumns =
    //   medicationData.map(
    //     ( medication ) => {
    //       return (
    //         {
    //         chemicalLABA: medication.chemicalLABA,
    //         chemicalICS: medication.chemicalICS,
    //         chemicalOther: medication.chemicalOther
    //         }
    //
    //      );
    //     });
    //
    // getMedicationColumns = _.uniqWith(getMedicationColumns, _.isEqual);
    // // console.log("medication chemical",getMedicationColumns);

    const onSubmitMedications = () => {
      //filter data from medicationList from medicationData and display it in results
      const filteredData = _
        .chain( this.props.medication.medicationList )
        .reduce(filteredData, medication => {
          filteredData.push(_
            .chain(medicationData)
            .filter((masterMedication) => {
              return medication.timesPerDayValue === masterMedication.timesPerDay &&
                     medication.doseICSValue === masterMedication.doseICS
            })
            .value()
          );
        }, [])
        .value();
      this.props.displayResult(this.props.medication.medicationList);
      // console.log("display: ", filteredData);
    };

    return (
      <div className="app">
        <div className="app__header">
          <Header />
        </div>
        <MedicationTable
          onSubmitMedications={ this.onSubmitMedications }
          onChangeMedication={ this.props.onMedicationSelection }
          onChangePuffValue={ this.props.onChangePuffValue }
          onChangeTimesPerDayValue={ this.props.onChangeTimesPerDayValue }
          onChangeDoseICS={ this.props.onChangeDoseICS }
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
        <div>

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