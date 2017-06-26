import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InputField from '../InputField/InputField.jsx';
import Row from '../Row/Row.jsx';
import * as actions from '../../redux/App/actions';
import './styles.css';


const MedicationTable = (
  {
    puffValue,
    timesPerDayValue,
    doseICSValue,
    patientMedications,
    onMedicationSelection,
    puffOnChange,
    timesOnChange,
    doseICSOnChange,
    onSubmit,
    appendMedicationToStack,
    stack,
    onDeleteRow,
  } ) => {

  console.log("stack: ", stack);

  const headerElements = ["Puff/Time", "Times/Day", "DoseICS", "Select Medication", ""];

  const renderAddRow = () => {
    const initalInputValues =
      {
        puffValue: '',
        timesPerDayValue: '',
        doseICSValue: '',
        patientMedications: '',
      };
    appendMedicationToStack(initalInputValues);
  };

  const deleteRow = (index) => {
    console.log("delete Row: index to delete from stack", index);
    onDeleteRow(index);

  };

 return (
   <div className="medication-table" onSubmit={onSubmit}>
     <div className="header">
       <ul>
        <Row elements={headerElements} />
       </ul>
     </div>

     <div className="main">
        <ul>
          {stack.map( (rowFields, index) => (
            <div key={index} className="row">
              <InputField
                fieldName="puff"
                value={puffValue}
                onChangeInputField={ (event) => puffOnChange(index, event.target.value) }
              />
              <InputField
                fieldName="times"
                value={timesPerDayValue}
                onChangeInputField={ (event) => timesOnChange(event.target.value) }
                />
              <InputField
                fieldName="doseICS"
                value={doseICSValue}
                onChangeInputField={ (event) => doseICSOnChange(event.target.value) }
              />
              <select
                className="row__select" onChange={ (event) => onMedicationSelection(event.target.value) }
                defaultValue={patientMedications}
              >
                <option>-Select Medication-</option>
                <option>ddd</option>
                <option>b</option>
                <option>c</option>
                </select>
                <button
                  className="button_deleteRow"
                  onClick={ () => deleteRow(index) }
                >
                  Delete Row
                </button>
            </div>
          ))}
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
  patientMedications: PropTypes.string,
  onDelEvent: PropTypes.func,
  onSelection: PropTypes.func,
  puffOnChange: PropTypes.func,
  timesOnChange: PropTypes.func,
  doseICSOnChange: PropTypes.func,
  onSubmit: PropTypes.func,
  appendMedicationToStack: PropTypes.func.isRequired,
};

MedicationTable.defaultProps = {
  puffValue: '',
  timesPerDayValue: '',
  doseICSValue: '',
};

const mapStateToProps = state => ({
  medication: state.medication,
});

const mapDispatchToProps = dispatch => ( {
  appendMedicationToStack: (medicationRow) => dispatch( actions.appendMedicationToStack(medicationRow) ),
  getPuffValue: (value) => dispatch( actions.getPuffValue(value) ),
  onPuffChange: (index, value) => dispatch( actions.onPuffChange(index, value) ),
  onTimesChange: (value) => dispatch( actions.onPuffChange(value) ),
  onDoseICSChange: (value) => dispatch( actions.onDoseICSChange(value) ),
  onMedicationSelection: (value) => dispatch( actions.onMedicationSelection(value) ),
  onDeleteRow: (index) => dispatch( actions.onDeleteRow(index) ),
} );

export default connect(mapStateToProps, mapDispatchToProps)(MedicationTable);