import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import keyIndex from 'react-key-index';
import _ from 'lodash';
import InputField from '../InputField/InputField';
import * as actions from '../../redux/App/actions';
import medicationData from '../../medicationData/medicationData';
import Row from '../Row/Row';
import './styles.css';

const MedicationTable = (
{
  addToNumberOfAddRowClicks,
  appendMedicationList,
  // chemicalICS,
  // chemicalLABA,
  // deviceName,
  doseICSValue,
  getPatientMedications,
  medication,
  // medicationName,
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
  const headerElements =
['', 'Device', 'Name', 'ChemicalLABA', 'ChemicalICS', 'DoseICS', '# of Puffs', 'Frequency', ''];

  const renderAddRow = ( click ) => {
    let initialInputValues = [{
      chemicalICS: '',
      chemicalLABA: '',
      deviceName: '',
      medicationName: '',
      doseICSValue: '',
      puffValue: '',
      timesPerDayValue: '',
    }];
    addToNumberOfAddRowClicks( click );
    // initialInputValues = keyIndex( initialInputValues, medication.clicks );
    const inputValues = keyIndex( headerElements, 1 );
    appendMedicationList( inputValues );
  };

  const deleteRow = ( index ) => {
    onClickDeleteMedication( index );
  };

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

  const onSubmitMedications = ( medicationToDisplay ) => {
    medicationToDisplay.map( ( filteredMedication, index ) => {
      return filteredMedication.map( ( addPuffToMedication ) => {
        return addPuffToMedication.puffPerTime = medication.medicationList[index].puffValue;
      } );
    } );
    // console.log("addPuffPerTime: ", _.flatten(displayMedications));
    getPatientMedications( _.flatten( medicationToDisplay ) );
  };

  // extract to its own component
  const displayRowContents = () => {
    return (
      medication.medicationList.map( ( rowFields, index ) => {
        let getDeviceColumn = medicationData.map(
          ( medicationDevice ) => {
            return ( {
              device: medicationDevice.device,
            } );
          } );
        getDeviceColumn = _.uniqWith( getDeviceColumn, _.isEqual );

        let getNameColumn = [{ name: 'Medication Name' }];
        getNameColumn = getNameColumn.concat( medicationData.map(
          ( masterMedication ) => {
            if ( masterMedication.device === medication.medicationList[index].deviceName ) {
              return ( {
                name: masterMedication.name,
              } );
            }

            return ( {
              none: '-no other medication names-',
            } );
          } ) );
        getNameColumn = _.uniqWith( getNameColumn, _.isEqual );
        getNameColumn = _.filter( getNameColumn, ( column ) => {
          return !( column.none );
        } );

        let getChemicalLABAColumn =
          medicationData.map(
            ( masterMedication ) => {
              if ( masterMedication.device === medication.medicationList[index].deviceName &&
                masterMedication.name === medication.medicationList[index].medicationName ) {
                return ( {
                  chemicalLABA: masterMedication.chemicalLABA,
                } );
              }

              return ( {
                none: '-no chemicalLABA-',
              } );
            } );

        getChemicalLABAColumn = _.uniqWith( getChemicalLABAColumn, _.isEqual );
        getChemicalLABAColumn = _.filter( getChemicalLABAColumn, ( column ) => {
          return column.chemicalLABA !== '.' && !( column.none );
        } );

        let getChemicalICSColumn =
          medicationData.map(
            ( masterMedication ) => {
              if ( masterMedication.device === medication.medicationList[index].deviceName &&
                  masterMedication.name === medication.medicationList[index].medicationName &&
                ( masterMedication.chemicalLABA === medication.medicationList[index].chemicalLABA ||
                  masterMedication.chemicalLABA === '.' ) &&
                ( medication.medicationList[index].chemicalLABA === '' ||
                medication.medicationList[index].chemicalLABA === 'ChemicalLABA' )
              ) {
                return ( {
                  chemicalICS: masterMedication.chemicalICS,
                } );
              }

              return ( {
                none: '-no chemicalICS-',
              } );
            } );

        getChemicalICSColumn = _.uniqWith( getChemicalICSColumn, _.isEqual );
        getChemicalICSColumn = _.filter( getChemicalICSColumn, ( column ) => {
          return column.chemicalICS !== '.' && !( column.none );
        } );

        return (
          <div key={rowFields._doseICSValueId} className="row">
            <p>Medication {index + 1 }:</p>
            <select
              className="device"
              onChange={event => onChangeDeviceName( index, _.split( event.target.value, ',' ) )}
              defaultValue={'Device'}
            >
              <option>Device</option>
              {
                getDeviceColumn.map(
                  ( medicationDevice, deviceIndex ) => (
                    <option key={deviceIndex}>{medicationDevice.device}</option>
                  ) ) }
            </select>
            <select
              className="name"
              onChange={event => onChangeMedicationName( index, _.split( event.target.value, ',' ) )}
              defaultValue={'Medication Name'}
            >
              {
                getNameColumn.map(
                  ( medicationName, nameIndex ) => (
                    <option key={nameIndex}>{medicationName.name}</option>
                  ) ) }
            </select>
            <select
              className="chemicalLABA"
              onChange={event => onChangeChemicalLABA( index, _.split( event.target.value, ',' ) )}
              defaultValue={'chemicalLABA'}
            >
              <option>ChemicalLABA</option>
              {
                getChemicalLABAColumn.map(
                  ( chemicalGroup, LABAindex ) => (
                    <option key={LABAindex}>{chemicalGroup.chemicalLABA}</option>
                  ) ) }
            </select>
            <select
              className="chemicalICS"
              onChange={event => onChangeChemicalICS( index, _.split( event.target.value, ',' ) )}
              defaultValue={'chemicalICS'}
            >
              <option>ChemicalICS</option>
              {
                getChemicalICSColumn.map(
                  ( chemicalGroup, ICSIndex ) => (
                    <option key={ICSIndex}>{chemicalGroup.chemicalICS}</option>
                  ) ) }
            </select>
            <InputField
              fieldName="doseICS"
              value={doseICSValue}
              placeholder="Dose ICS"
              onChangeInputField={event => onChangeDoseICS( index, event.target.value )}
            />
            <InputField
              fieldName="puff"
              value={puffValue}
              placeholder="# of puffs"
              onChangeInputField={event => onChangePuffValue( index, event.target.value )}
            />
            <InputField
              fieldName="times"
              value={timesPerDayValue}
              placeholder="Frequency"
              onChangeInputField={event => onChangeTimesPerDayValue( index, event.target.value )}
            />
            <button
              className="button__deleteRow"
              onClick={() => deleteRow( index )}
            >
              Delete Row
            </button>
          </div>
        );
      } ) );
  };

  return (
    <div className="medication-table">
      <div className="header">
        <h3>Enter Your Medications:</h3>
      </div>
      <div className="medicationHeader">
        <Row>{headerElements}</Row>
      </div>

      <div className="main">
        {displayRowContents()}
      </div>
      <button
        className="button__addRow"
        onClick={() => renderAddRow( 1 )}
      >
        Add Row
      </button>
      <input
        className="submit"
        type="submit"
        value="Submit"
        onClick={() => onSubmitMedications( displayMedications )}
      />
    </div>
  );
};

MedicationTable.propTypes = {
  addToNumberOfAddRowClicks: PropTypes.func.isRequired,
  puffValue: PropTypes.string,
  timesPerDayValue: PropTypes.string,
  doseICSValue: PropTypes.string,
  getPatientMedications: PropTypes.func.isRequired,
  onClickDeleteMedication: PropTypes.func.isRequired,
  onChangeDeviceName: PropTypes.func.isRequired,
  onChangePuffValue: PropTypes.func.isRequired,
  onChangeTimesPerDayValue: PropTypes.func.isRequired,
  onChangeDoseICS: PropTypes.func.isRequired,
  onChangeChemicalICS: PropTypes.func.isRequired,
  onChangeChemicalLABA: PropTypes.func.isRequired,
  onChangeMedicationName: PropTypes.func.isRequired,
  appendMedicationList: PropTypes.func.isRequired,
};

MedicationTable.defaultProps = {
  puffValue: '',
  deviceName: '',
  timesPerDayValue: '',
  doseICSValue: '',
  medicationList: [],
};

const mapStateToProps = state => ( {
  medication: state.medication,
} );

const mapDispatchToProps = dispatch => ( {
  addToNumberOfAddRowClicks: click => dispatch( actions.addToNumberOfAddRowClicks( click ) ),
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

export default connect( mapStateToProps, mapDispatchToProps )( MedicationTable );
