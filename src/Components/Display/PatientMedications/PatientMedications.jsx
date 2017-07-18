import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import medicationData from '../../../medicationData/medicationData';
import * as actions from '../../../redux/App/actions';
import './styles.css';

const DisplayPatientMedications = ( {
                                     chemicalICS, chemicalLABA, medication,
                                   } ) => {
  const displayMedications = _
    .chain( medication.medicationList )
    .reduce( ( filteredData, medication ) => {
      filteredData.push(
        _.chain( medicationData )
          .filter( ( masterMedication ) => {
            return (
              (
                medication.timesPerDayValue === masterMedication.timesPerDay ||
                ( medication.timesPerDayValue === '' && masterMedication.timesPerDay === '.' ) ||
                ( medication.timesPerDayValue === '1' && masterMedication.timesPerDay === '1 OR 2' ) ||
                ( medication.timesPerDayValue === '2' && masterMedication.timesPerDay === '1 OR 2' )
              ) &&
              (
                medication.doseICSValue === masterMedication.doseICS ||
                medication.doseICSValue === '' && masterMedication.doseICS === '.'
              ) &&
              (
                medication.chemicalLABA === masterMedication.chemicalLABA ||
                (medication.chemicalLABA === 'chemicalLABA' || medication.chemicalLABA === '' ) &&
                masterMedication.chemicalLABA === '.'
              ) &&
              (
                medication.chemicalICS === masterMedication.chemicalICS ||
                ( medication.chemicalICS === 'chemicalICS' || medication.chemicalICS === '' ) &&
                masterMedication.chemicalICS === '.'
              ) &&
              ( medication.medicationName === masterMedication.name ) &&
              ( medication.deviceName === masterMedication.device )
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
                      <p className="medication">Medication {rowIndex + 1}</p>
                      <p>ID: {patientMedication.id}</p>
                      <p>Device: {patientMedication.device}</p>
                      <p>Name: {patientMedication.name}</p>
                      <p>chemicalLABA: {patientMedication.chemicalLABA}</p>
                      <p>chemicalICS: {patientMedication.chemicalICS}</p>
                      <p>Dose ICS:{patientMedication.doseICS}</p>
                      <p>Max Puff: {patientMedication.maxPuffPerTime}</p>
                      <p>Times Per Day: {patientMedication.timesPerDay}</p>
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
      <h3>Your Medications:</h3>
      {showPatientMedications}
    </div>
  );
};

const mapStateToProps = state => ( {
  medication: state.medication,
} );

const mapDispatchToProps = dispatch => ( {
  appendMedicationList: ( medicationRow ) => dispatch( actions.appendMedicationList( medicationRow ) ),
  onChangePuffValue: ( index, value ) => dispatch( actions.onChangePuffValue( index, value ) ),
  onChangeTimesPerDayValue: ( index, value ) => dispatch( actions.onChangeTimesPerDayValue( index, value ) ),
  onChangeDoseICS: ( index, value ) => dispatch( actions.onChangeDoseICS(index, value ) ),
  onChangeDeviceName: ( index, value ) => dispatch( actions.onChangeDeviceName( index, value ) ),
  onChangeChemicalICS: ( index, value) => dispatch( actions.onChangeChemicalICS( index, value ) ),
  onChangeChemicalLABA: ( index, value) => dispatch( actions.onChangeChemicalLABA( index, value ) ),
  onChangeMedicationName: ( index, value ) => dispatch( actions.onChangeMedicationName( index, value ) ),
  onDeleteRow: ( index ) => dispatch( actions.onDeleteRow( index ) ),
  getPatientMedications: ( medications ) => dispatch( actions.getPatientMedications( medications ) ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( DisplayPatientMedications );
