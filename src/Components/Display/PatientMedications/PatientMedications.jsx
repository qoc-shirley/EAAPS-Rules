import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import medicationData from '../../../medicationData/medicationData';
import * as actions from '../../../redux/App/actions';
import './styles.css';

const DisplayPatientMedications = ( { medication } ) => {
  // const headerElements =
  //   ['', 'Device', 'Name', 'ChemicalLABA', 'ChemicalICS', 'DoseICS', '# of Puffs', 'Frequency', ''];
  const displayMedications = _
    .chain( medication.medicationList )
    .reduce( ( filteredData, patientMedication ) => {
      filteredData.push(
        _.chain( medicationData )
          .filter( ( masterMedication ) => {
            return (
              (
                patientMedication.timesPerDayValue === masterMedication.timesPerDay ||
                ( patientMedication.timesPerDayValue === '' && masterMedication.timesPerDay === '.' ) ||
                ( patientMedication.timesPerDayValue === '1' && masterMedication.timesPerDay === '1 OR 2' ) ||
                ( patientMedication.timesPerDayValue === '2' && masterMedication.timesPerDay === '1 OR 2' )
              ) &&
              (
                ( patientMedication.doseICSValue === masterMedication.doseICS ) ||
                ( patientMedication.doseICSValue === '' && masterMedication.doseICS === '.' )
              ) &&
              (
                ( patientMedication.chemicalLABA === masterMedication.chemicalLABA ) ||
                ( ( patientMedication.chemicalLABA === 'chemicalLABA' || patientMedication.chemicalLABA === '' ) &&
                  ( masterMedication.chemicalLABA === '.' ) )
              ) &&
              (
                ( patientMedication.chemicalICS === masterMedication.chemicalICS ) ||
                ( ( patientMedication.chemicalICS === 'chemicalICS' || patientMedication.chemicalICS === '' ) &&
                  ( masterMedication.chemicalICS === '.' ) )
              ) &&
              ( patientMedication.medicationName === masterMedication.name ) &&
              ( patientMedication.deviceName === masterMedication.device ) &&
              ( patientMedication.puffValue <= masterMedication.maxPuffPerTime )
            );
          } )
          .value(),
        );

      return filteredData;
      }, [] )
    .value();

  let showPatientMedications = null;
  if ( _.isEmpty( displayMedications ) ) {
    showPatientMedications = <p key="on">No Medications were found</p>;
  }
  else {
    showPatientMedications = displayMedications.map(
      ( row, rowIndex ) => {
        if ( _.isEmpty( row ) ) {
          return (
            <div key={rowIndex} className="medicationRow">
              <div className="filteredMedications">
                <p className="medication">Medication {rowIndex + 1}</p>
                <p>No Medications were found</p>
              </div>
            </div>
          );
        }

        return (
          <div key={rowIndex} className="medicationRow">
            {
              row.map(
                ( patientMedication, index ) => {
                  return (
                    <div key={index} className="filteredMedications">
                      <p className="title" id="medication">Medication {rowIndex + 1}</p>
                      <p className="title">{patientMedication.id}</p>
                      <p className="title">{patientMedication.device}</p>
                      <p className="title">{patientMedication.name}</p>
                      <p className="title">{patientMedication.chemicalLABA}</p>
                      <p className="title">{patientMedication.chemicalICS}</p>
                      <p className="title">{patientMedication.doseICS}</p>
                      <p className="title">{patientMedication.maxPuffPerTime}</p>
                      <p className="title">{patientMedication.timesPerDay}</p>
                    </div>
                  );
                },
              )
            }
          </div>
        );
      },
    );
  }

  return (
    <div className="patientMedications">
      <h3>Your Medications</h3>
      <div className="header">
        <p className="title" />
        <p className="title">Id</p>
        <p className="title">Device</p>
        <p className="title">Name</p>
        <p className="title">ChemicalLABA</p>
        <p className="title">ChemicalICS</p>
        <p className="title">Dose ICS</p>
        <p className="title">Max Puff Per Time</p>
        <p className="title">Times Per Day</p>
      </div>
      {showPatientMedications}
    </div>
  );
};

const mapStateToProps = state => ( {
  medication: state.medication,
} );

const mapDispatchToProps = dispatch => ( {
  appendMedicationList: medicationRow => dispatch( actions.appendMedicationList( medicationRow ) ),
  onChangePuffValue: ( index, value ) => dispatch( actions.onChangePuffValue( index, value ) ),
  onChangeTimesPerDayValue: ( index, value ) => dispatch( actions.onChangeTimesPerDayValue( index, value ) ),
  onChangeDoseICS: ( index, value ) => dispatch( actions.onChangeDoseICS( index, value ) ),
  onChangeDeviceName: ( index, value ) => dispatch( actions.onChangeDeviceName( index, value ) ),
  onChangeChemicalICS: ( index, value ) => dispatch( actions.onChangeChemicalICS( index, value ) ),
  onChangeChemicalLABA: ( index, value ) => dispatch( actions.onChangeChemicalLABA( index, value ) ),
  onChangeMedicationName: ( index, value ) => dispatch( actions.onChangeMedicationName( index, value ) ),
  onDeleteRow: index => dispatch( actions.onDeleteRow( index ) ),
  getPatientMedications: medications => dispatch( actions.getPatientMedications( medications ) ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( DisplayPatientMedications );
