import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import InputField from '../InputField/InputField';
import * as actions from '../../redux/App/actions';
import medicationData from '../MedicationData/MedicationData';
import './styles.css';

const MedicationTable = (
  {
    appendMedicationList,
    chemicalICS,
    chemicalLABA,
    deviceName,
    doseICSValue,
    medicationList,
    medicationName,
    onChangeDoseICS,
    onChangeChemicalLABA,
    onChangeChemicalICS,
    onChangeDeviceName,
    onChangePuffValue,
    onChangeTimesPerDayValue,
    onChangeMedicationName,
    onClickDeleteMedication,
    puffValue,
    timesPerDayValue,
  } ) => {

  const renderAddRow = () => {
    const initalInputValues =
      {
        chemicalICS: '',
        chemicalLABA: '',
        deviceName: '',
        doseICSValue: '',
        puffValue: '',
        timesPerDayValue: '',
      };
    appendMedicationList(initalInputValues);
  };

  const deleteRow = (index) => {
    onClickDeleteMedication(index);
  };

  let getChemicalLABAColumn =
    medicationData.map(
      ( medication ) => {
        return (
          {
            chemicalLABA: medication.chemicalLABA,
          }
        );
      });

  getChemicalLABAColumn = _.uniqWith(getChemicalLABAColumn, _.isEqual);
  getChemicalLABAColumn = _.filter(getChemicalLABAColumn, (column) => { return column.chemicalLABA !== "." } );

  let getChemicalICSColumn =
    medicationData.map(
      ( medication ) => {
        return (
          {
            chemicalICS: medication.chemicalICS,
          }
        );
      });

  getChemicalICSColumn = _.uniqWith(getChemicalICSColumn, _.isEqual);
  getChemicalICSColumn = _.filter(getChemicalICSColumn, (column) => { return column.chemicalICS !== "." } );

  let getDeviceColumn = medicationData.map(
    ( medication ) => {
      return (
        {
          device: medication.device,
        }
      );
    });
  getDeviceColumn = _.uniqWith(getDeviceColumn, _.isEqual);

  let getNameColumn = medicationData.map(
    ( medication ) => {
      return (
        {
          name: medication.name,
        }
      );
    });
  getNameColumn = _.uniqWith(getNameColumn, _.isEqual);

  const displayRowContents = () => {
    return(
      medicationList.map( (rowFields, index) => (
        <div key={index} className="row">
          <select
            className="device"
            onChange={
              (event) => onChangeDeviceName(index, _.split(event.target.value, ","))}
            defaultValue={deviceName}
          >
            <option>Device</option>
            {
              getDeviceColumn.map(
                (medicationDevice, index) => (
                  <option key={index}>{medicationDevice.device}</option>
                ))}
          </select>
          <select
            className="name"
            onChange={
              (event) => onChangeMedicationName(index, _.split(event.target.value, ","))}
            defaultValue={medicationName}
          >
            <option>Medication Name</option>
            {
              getNameColumn.map(
                (medicationName, index) => (
                  <option key={index}>{medicationName.name}</option>
                ))}
          </select>
          <select
            className="chemicalLABA"
            onChange={
              (event) => onChangeChemicalLABA(index, _.split(event.target.value, ","))}
            defaultValue={chemicalLABA}
          >
            <option>ChemicalLABA</option>
            {
              getChemicalLABAColumn.map(
                (chemicalGroup, index) => (
                  <option key={index}>{chemicalGroup.chemicalLABA}</option>
                ))}
          </select>
          <select
            className="chemicalICS"
            onChange={
              (event) => onChangeChemicalICS(index, _.split(event.target.value, ","))}
            defaultValue={chemicalICS}
          >
            <option>ChemicalICS</option>
            {
              getChemicalICSColumn.map(
                (chemicalGroup, index) => (
                  <option key={index}>{chemicalGroup.chemicalICS}</option>
                ))}
          </select>
          <InputField
            fieldName="doseICS"
            value={doseICSValue}
            placeholder="Dose ICS"
            onChangeInputField={(event) => onChangeDoseICS(index, event.target.value)}
          />
          <InputField
            fieldName="puff"
            value={puffValue}
            placeholder="# of puffs"
            onChangeInputField={(event) => onChangePuffValue(index, event.target.value)}
          />
          <InputField
            fieldName="times"
            value={timesPerDayValue}
            placeholder="Frequency"
            onChangeInputField={(event) => onChangeTimesPerDayValue(index, event.target.value)}
          />
          <button
            className="button_deleteRow"
            onClick={() => deleteRow(index)}
          >
            Delete Row
          </button>
        </div>
    )));
  };
 return (
   <div className="medication-table">
     <div className="header">
       <h3>Enter Your Medications:</h3>
     </div>

     <div className="main">
       <ul>
         {displayRowContents()}
       </ul>
     </div>
     <button
       className="button__addRow"
       onClick={renderAddRow}
     >
       Add Row
     </button>
   </div>
 );
};

MedicationTable.propTypes = {
  puffValue: PropTypes.string,
  timesPerDayValue: PropTypes.string,
  doseICSValue: PropTypes.string,
  onClickDeleteMedication: PropTypes.func.isRequired,
  onChangeDeviceName: PropTypes.func.isRequired,
  onChangePuffValue: PropTypes.func.isRequired,
  onChangeTimesPerDayValue: PropTypes.func.isRequired,
  onChangeDoseICS: PropTypes.func.isRequired,
  onChangeChemicalICS: PropTypes.func.isRequired,
  onChangeChemicalLABA: PropTypes.func.isRequired,
  onChangeMedicationName: PropTypes.func.isRequired,
  appendMedicationList: PropTypes.func.isRequired,
  medicationList: PropTypes.array,
  deviceName: PropTypes.string,


};

MedicationTable.defaultProps = {
  puffValue: '',
  deviceName: '',
  timesPerDayValue: '',
  doseICSValue: '',
  medicationList: [],
};

const mapStateToProps = state => ({
  medication: state.medication,
});

const mapDispatchToProps = dispatch => ( {
  appendMedicationList: (medicationRow) => dispatch( actions.appendMedicationList(medicationRow) ),
  onChangePuffValue: (index, value) => dispatch( actions.onChangePuffValue(index, value) ),
  onChangeTimesPerDayValue: (index, value) => dispatch( actions.onChangeTimesPerDayValue(index, value) ),
  onChangeDoseICS: (index, value) => dispatch( actions.onChangeDoseICS(index, value) ),
  onChangeDeviceName: (index, value) => dispatch( actions.onChangeDeviceName(index, value) ),
  onChangeChemicalICS: (index, value) => dispatch( actions.onChangeChemicalICS(index, value) ),
  onChangeChemicalLABA: (index, value) => dispatch( actions.onChangeChemicalLABA(index, value) ),
  onChangeMedicationName: (index, value) => dispatch( actions.onChangeMedicationName(index, value) ),
  onDeleteRow: (index) => dispatch( actions.onDeleteRow(index) ),
} );

export default connect(mapStateToProps, mapDispatchToProps)(MedicationTable);