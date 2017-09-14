import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import './styles.css';

const DisplayPatientMedications = ( { medication } ) => {
  let showPatientMedications = null;
  if ( _.isEmpty( medication.patientMedications ) ) {
    showPatientMedications = <p key="on">No Medications were found</p>;
  }
  else {
    showPatientMedications = medication.patientMedications.map(
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
            <div key={rowIndex} className="filteredMedications">
              <p className="title" id="medication">Medication {rowIndex + 1}</p>
              <p className="title">{row.id}</p>
              <p className="title">{row.device}</p>
              <p className="title">{row.name}</p>
              <p className="title">{row.chemicalLABA}</p>
              <p className="title">{row.chemicalICS}</p>
              <p className="title">{row.doseICS}</p>
              <p className="title">{row.puffsPerTime}</p>
              <p className="title">{row.timesPerDay}</p>
            </div>
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
        <p className="title">Puff Per Time</p>
        <p className="title">Times Per Day</p>
      </div>
      {showPatientMedications}
    </div>
  );
};

const mapStateToProps = state => ( {
  medication: state.medication,
} );

export default connect( mapStateToProps )( DisplayPatientMedications );
