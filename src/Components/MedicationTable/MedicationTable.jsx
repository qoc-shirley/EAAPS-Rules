import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import InputField from '../InputField/InputField';
import Row from '../Row/Row';
import * as actions from '../../redux/App/actions';
import medicationData from '../MedicationData/MedicationData';
import './styles.css';

const MedicationTable = (
  {
    appendMedicationList,
    availableMedications,
    doseICSValue,
    medicationList,
    onChangeDoseICS,
    onChangeMedication,
    onChangePuffValue,
    onChangeTimesPerDayValue,
    onClickDeleteMedication,
    puffValue,
    timesPerDayValue,
  } ) => {

  const headerElements = ["Puff/Time", "Times/Day", "DoseICS", "Select Medication", ""];

  const renderAddRow = () => {
    const initalInputValues =
      {
        doseICSValue: '',
        availableMedications: '',
        puffValue: '',
        timesPerDayValue: '',
      };
    appendMedicationList(initalInputValues);
  };

  const deleteRow = (index) => {
    onClickDeleteMedication(index);
  };

  let getMedicationColumns =
    medicationData.map(
      ( medication ) => {
        return (
          {
            chemicalLABA: medication.chemicalLABA,
            chemicalICS: medication.chemicalICS,
          }
        );
      });

  getMedicationColumns = _.uniqWith(getMedicationColumns, _.isEqual);

  let getChemicalLABA = medicationData.map(
    ( medication ) => {
      return (
        {
          chemicalLABA: medication.chemicalLABA,
        }
      );
    });

  let getChemicalICS = medicationData.map(
    ( medication ) => {
      return (
        {
          chemicalICS: medication.chemicalICS,
        }
      );
    });
  getChemicalLABA = _.uniqWith(getChemicalLABA, _.isEqual);
  getChemicalICS = _.uniqWith(getChemicalICS, _.isEqual);

  const displayRowContents = () => {
    return(
      medicationList.map( (rowFields, index) => (
        <div key={index} className="row">
          <InputField
            fieldName="puff"
            value={puffValue}
            onChangeInputField={(event) => onChangePuffValue(index, event.target.value)}
          />
          <InputField
            fieldName="times"
            value={timesPerDayValue}
            onChangeInputField={(event) => onChangeTimesPerDayValue(index, event.target.value)}
          />
          <InputField
            fieldName="doseICS"
            value={doseICSValue}
            onChangeInputField={(event) => onChangeDoseICS(index, event.target.value)}
          />
          <select
            className="row__select"
            onChange={
              (event) => onChangeMedication(index, _.split(event.target.value, ","))}
            defaultValue={availableMedications}
          >
            <option>ChemicalLABA,ChemicalICS,ChemicalOther</option>
            {
              getMedicationColumns.map(
                (chemicalGroup, index) => (
                  <option key={index}>{chemicalGroup.chemicalLABA},{chemicalGroup.chemicalICS},{chemicalGroup.chemicalOther}</option>
            ))}
          </select>
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
       <ul>
         <Row>
           {headerElements}
         </Row>
       </ul>
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
  onChangeMedication: PropTypes.func.isRequired,
  onChangePuffValue: PropTypes.func.isRequired,
  onChangeTimesPerDayValue: PropTypes.func.isRequired,
  onChangeDoseICS: PropTypes.func.isRequired,
  appendMedicationList: PropTypes.func.isRequired,
  availableMedications: PropTypes.string,
  medicationList: PropTypes.array.isRequired,
};

MedicationTable.defaultProps = {
  puffValue: '',
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
  onChangeMedication: (index, value) => dispatch( actions.onChangeMedication(index, value) ),
  onDeleteRow: (index) => dispatch( actions.onDeleteRow(index) ),
} );

export default connect(mapStateToProps, mapDispatchToProps)(MedicationTable);