import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import uuid from 'uuid';
// import InputField from '../InputField/InputField';
import * as actions from '../../redux/App/actions';
import medicationData from '../../medicationData/medicationData';
import Row from '../Row/Row';
import './styles.css';

const MedicationTable = (
{
  appendMedicationList,
  // doseICSValue,
  getPatientMedications,
  medication,
  onChangeDoseICS,
  onChangeChemical,
  onChangeChemicalICS,
  onChangeDeviceName,
  onChangePuffValue,
  onChangeTimesPerDayValue,
  onChangeMedicationName,
  onClickDeleteMedication,
  // puffValue,
  // timesPerDayValue,
} ) => {
  const headerElements =
['', 'Device', 'Name', 'ChemicalLABA', 'ChemicalICS', 'DoseICS', '# of Puffs', 'Frequency', ''];

  const randomGenerator = uuid();

  const renderAddRow = () => {
    const initialInputValues = [{
      chemicalICS: '',
      chemicalLABA: '',
      deviceName: '',
      medicationName: '',
      doseICSValue: '',
      puffValue: '',
      timesPerDayValue: '',
      id: randomGenerator,
    }];
    appendMedicationList( initialInputValues );
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
        addPuffToMedication.puffPerTime = medication.medicationList[index].puffValue;
        addPuffToMedication.timesPerDay = medication.medicationList[index].timesPerDayValue;

        return addPuffToMedication;
      } );
    } );
    // console.log("addPuffPerTime: ", _.flatten(displayMedications));
    getPatientMedications( _.flatten( medicationToDisplay ) );
  };

  // extract to its own component
  const displayRowContents = () => {
    return (
      medication.medicationList.map( ( rowFields, index ) => {
        let getDeviceColumn = [{ device: 'Device' }];
        getDeviceColumn = getDeviceColumn.concat( medicationData.map(
          ( medicationDevice ) => {
            return ( {
              device: medicationDevice.device,
            } );
          } ) );
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

        // let getChemicalLABAColumn = [{ chemicalLABA: 'ChemicalLABA' }];
        let getChemicalLABAColumn = medicationData.map(
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
        if ( _.isEmpty( getChemicalLABAColumn ) ) {
          getChemicalLABAColumn = [{ chemicalLaba: ' ---' }];
        }

        // let getChemicalICSColumn = [{ chemicalICS: 'ChemicalICS' }];
        let getChemicalICSColumn =
          medicationData.map(
            ( masterMedication ) => {
              if ( masterMedication.device === medication.medicationList[index].deviceName &&
                   masterMedication.name === medication.medicationList[index].medicationName &&
                  (
                    masterMedication.chemicalLABA === medication.medicationList[index].chemicalLABA ||
                    (
                      masterMedication.chemicalLABA === '.' &&
                      (
                        medication.medicationList[index].chemicalLABA === '' ||
                        medication.medicationList[index].chemicalLABA === 'ChemicalLABA' ) ) ) ) {
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

        if ( _.isEmpty( getChemicalICSColumn ) ) {
          getChemicalICSColumn = [{ chemicalICS: ' ---' }];
        }

        console.log('chemicalLaba: ',getChemicalLABAColumn);
        console.log('chemicalICS: ',getChemicalICSColumn);
        let getDoseICSColumn = [{ doseICS: 'DoseICS' }];
        getDoseICSColumn = getDoseICSColumn.concat(
          medicationData.map(
            ( masterMedication ) => {
              if ( masterMedication.device === medication.medicationList[index].deviceName &&
                masterMedication.name === medication.medicationList[index].medicationName &&
                (
                  masterMedication.chemicalLABA === medication.medicationList[index].chemicalLABA ||
                  (
                    masterMedication.chemicalLABA === '.' &&
                    (
                      medication.medicationList[index].chemicalLABA === '' ||
                      medication.medicationList[index].chemicalLABA === 'ChemicalLABA' ) )
                ) &&
                (
                  masterMedication.chemicalICS === medication.medicationList[index].chemicalICS ||
                  (
                    masterMedication.chemicalICS === '.' &&
                    (
                      medication.medicationList[index].chemicalICS === '' ||
                      medication.medicationList[index].chemicalICS === 'ChemicalICS'
                    )
                  )
                )
              ) {
                return ( {
                  doseICS: masterMedication.doseICS,
                } );
              }

              return ( {
                none: '-no doseICS-',
              } );
            } ) );

        getDoseICSColumn = _.uniqWith( getDoseICSColumn, _.isEqual );
        getDoseICSColumn = _.filter( getDoseICSColumn, ( column ) => {
          return column.doseICS !== '.' && !( column.none );
        } );

        let getPuffColumn = [{ puffPerTime: 'PuffPerTime' }];
        getPuffColumn = getPuffColumn.concat(
          medicationData.map(
            ( masterMedication ) => {
              if ( masterMedication.device === medication.medicationList[index].deviceName &&
                masterMedication.name === medication.medicationList[index].medicationName &&
                ( masterMedication.chemicalLABA === medication.medicationList[index].chemicalLABA ||
                  ( masterMedication.chemicalLABA === '.' &&
                    ( medication.medicationList[index].chemicalLABA === '' ||
                      medication.medicationList[index].chemicalLABA === 'ChemicalLABA' ) ) ) &&
                ( masterMedication.chemicalICS === medication.medicationList[index].chemicalICS ||
                  ( masterMedication.chemicalICS === '.' &&
                    ( medication.medicationList[index].chemicalICS === '' ||
                      medication.medicationList[index].chemicalICS === 'ChemicalICS' ) ) ) &&
                ( masterMedication.doseICS === medication.medicationList[index].doseICSValue ||
                  ( masterMedication.doseICS === '.' &&
                    ( medication.medicationList[index].doseICSValue === '' ||
                      medication.medicationList[index].doseICSValue === 'DoseICS' ) ) )
              ) {
                return ( {
                  puffPerTime: masterMedication.maxPuffPerTime,
                } );
              }

              return ( {
                none: '-no doseICS-',
              } );
            } ) );
        getPuffColumn = _.uniqWith( getPuffColumn, _.isEqual );
        getPuffColumn = _.filter( getPuffColumn, ( column ) => {
          return column.puffPerTime !== '.' && !( column.none );
        } );
        let getPuffColumnRange = [{ puffPerTime: 'PuffPerTime' }];
        if ( !_.isEmpty( getPuffColumn ) ) {
          getPuffColumnRange = _.range( _.toInteger( getPuffColumn[0].timesPerDay ) + 1 );
          getPuffColumnRange = _.chain( getPuffColumnRange )
            .reduce( ( accResult, timesValue ) => {
              if ( timesValue === 0 ) {
                accResult.push( { puffPerTime: 'TimesPerDay' } );

                return accResult;
              }
              accResult.push( { puffPerTime: timesValue } );

              return accResult;
            }, [] )
            .value();
        }

        // let getTimesColumn = [{ timesPerDay: 'TimesPerDay' }];
        let getTimesColumn = [];
        getTimesColumn = getTimesColumn.concat(
          medicationData.map(
            ( masterMedication ) => {
              if ( masterMedication.device === medication.medicationList[index].deviceName &&
                masterMedication.name === medication.medicationList[index].medicationName &&
                ( masterMedication.chemicalLABA === medication.medicationList[index].chemicalLABA ||
                  ( masterMedication.chemicalLABA === '.' &&
                    ( medication.medicationList[index].chemicalLABA === '' ||
                      medication.medicationList[index].chemicalLABA === 'ChemicalLABA' ) ) ) &&
                ( masterMedication.chemicalICS === medication.medicationList[index].chemicalICS ||
                  ( masterMedication.chemicalICS === '.' &&
                    ( medication.medicationList[index].chemicalICS === '' ||
                      medication.medicationList[index].chemicalICS === 'ChemicalICS' ) ) ) &&
                ( masterMedication.doseICS === medication.medicationList[index].doseICSValue ||
                  ( masterMedication.doseICS === '.' &&
                    ( medication.medicationList[index].doseICSValue === '' ||
                      medication.medicationList[index].doseICSValue === 'DoseICS' ) ) ) &&
                 masterMedication.maxPuffPerTime >= medication.medicationList[index].puffValue
              ) {
                return ( {
                  timesPerDay: masterMedication.timesPerDay,
                } );
              }

              return ( {
                none: '-no timesPerDay-',
              } );
            } ) );
        getTimesColumn = _.uniqWith( getTimesColumn, _.isEqual );
        getTimesColumn = _.filter( getTimesColumn, ( column ) => {
          return column.timesPerDay !== '.' && !( column.none );
        } );

        let getTimesColumnRange = [ { timesPerDay: 'TimesPerDay' } ];
        if ( !_.isEmpty( getTimesColumn ) ) {
          getTimesColumnRange = _.range( _.toInteger( getTimesColumn[0].timesPerDay ) + 1 );
          getTimesColumnRange = _.chain( getTimesColumnRange )
            .reduce( ( accResult, timesValue ) => {
              if ( timesValue === 0 ) {
                accResult.push({timesPerDay: 'TimesPerDay' });

                return accResult;
              }
              accResult.push({ timesPerDay: timesValue });

              return accResult;
            }, [] )
            .value();
        }

        return (
          <div key={rowFields.id} className="row">
            <p>Medication {index + 1 }:</p>
            <select
              className="device"
              onChange={event => onChangeDeviceName( index, _.split( event.target.value, ',' ) )}
              value={rowFields.deviceName}
            >
              {
                getDeviceColumn.map(
                  ( medicationDevice, deviceIndex ) => (
                    <option key={deviceIndex}>{medicationDevice.device}</option>
                  ) ) }
            </select>
            <select
              className="name"
              onChange={event => onChangeMedicationName( index, _.split( event.target.value, ',' ) )}
              value={rowFields.medicationName}
            >
              {
                getNameColumn.map(
                  ( medicationName, nameIndex ) => (
                    <option key={nameIndex}>{medicationName.name}</option>
                  ) ) }
            </select>
            <select
              className="chemicalLABA"
              onChange={event => onChangeChemical( index, _.split( event.target.value, ',' ) )}
              value={rowFields.chemical}
            >
              <option>ChemicalLaba,ChemicalICS</option>
              <option>{getChemicalLABAColumn[0].chemicalLABA},{getChemicalICSColumn[0].chemicalICS}</option>
              {/*{*/}
                {/*getChemicalLABAColumn.map(*/}
                  {/*( chemicalGroup, LABAindex ) => (*/}
                    {/*<option key={LABAindex}>{chemicalGroup.chemicalLABA}</option>*/}
                  {/*) ) }*/}
            </select>
            {/*<select*/}
              {/*className="chemicalICS"*/}
              {/*onChange={event => onChangeChemicalICS( index, _.split( event.target.value, ',' ) )}*/}
              {/*value={rowFields.chemicalICS}*/}
            {/*>*/}
              {/*{*/}
                {/*getChemicalICSColumn.map(*/}
                  {/*( chemicalGroup, ICSIndex ) => (*/}
                    {/*<option key={ICSIndex}>{chemicalGroup.chemicalICS}</option>*/}
                  {/*) ) }*/}
            {/*</select>*/}
            <select
              className="doseICS"
              onChange={event => onChangeDoseICS( index, _.split( event.target.value, ',' ) )}
              value={rowFields.doseICSValue}
            >
              {
                getDoseICSColumn.map(
                  ( chemicalGroup, ICSIndex ) => (
                    <option key={ICSIndex}>{chemicalGroup.doseICS}</option>
                  ) ) }
            </select>
            <select
              className="puffPerTime"
              onChange={event => onChangePuffValue( index, _.split( event.target.value, ',' ) )}
              value={rowFields.puffValue}
            >
              {
                getPuffColumnRange.map(
                  ( chemicalGroup, ICSIndex ) => (
                    <option key={ICSIndex}>{chemicalGroup.puffPerTime}</option>
                  ) ) }
            </select>
            <select
              className="timesPerDay"
              onChange={event => onChangeTimesPerDayValue( index, _.split( event.target.value, ',' ) )}
              value={rowFields.timesPerDayValue}
            >
              {
                getTimesColumnRange.map(
                  ( chemicalGroup, ICSIndex ) => (
                    <option key={ICSIndex}>{chemicalGroup.timesPerDay}</option>
                  ) ) }
            </select>
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
        onClick={renderAddRow}
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
  // puffValue: PropTypes.string,
  // timesPerDayValue: PropTypes.string,
  // doseICSValue: PropTypes.string,
  getPatientMedications: PropTypes.func.isRequired,
  onClickDeleteMedication: PropTypes.func.isRequired,
  onChangeDeviceName: PropTypes.func.isRequired,
  onChangePuffValue: PropTypes.func.isRequired,
  onChangeTimesPerDayValue: PropTypes.func.isRequired,
  onChangeDoseICS: PropTypes.func.isRequired,
  onChangeChemicalICS: PropTypes.func.isRequired,
  onChangeChemical: PropTypes.func.isRequired,
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
  appendMedicationList: medicationRow => dispatch( actions.appendMedicationList( medicationRow ) ),
  onChangePuffValue: ( index, value ) => dispatch( actions.onChangePuffValue( index, value ) ),
  onChangeTimesPerDayValue: ( index, value ) => dispatch( actions.onChangeTimesPerDayValue( index, value ) ),
  onChangeDoseICS: ( index, value ) => dispatch( actions.onChangeDoseICS( index, value ) ),
  onChangeDeviceName: ( index, value ) => dispatch( actions.onChangeDeviceName( index, value ) ),
  onChangeChemicalICS: ( index, value ) => dispatch( actions.onChangeChemicalICS( index, value ) ),
  onChangeChemical: ( index, value ) => dispatch( actions.onChangeChemical( index, value ) ),
  onChangeMedicationName: ( index, value ) => dispatch( actions.onChangeMedicationName( index, value ) ),
  onDeleteRow: index => dispatch( actions.onDeleteRow( index ) ),
  getPatientMedications: medications => dispatch( actions.getPatientMedications( medications ) ),
} );

export default connect( mapStateToProps, mapDispatchToProps )( MedicationTable );
