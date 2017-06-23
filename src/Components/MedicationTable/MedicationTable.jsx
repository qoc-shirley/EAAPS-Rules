import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InputField from '../InputField/InputField.jsx';
import Row from '../Row/Row.jsx';
// import Stack from '../Stack/Stack.jsx';
import * as actions from '../../redux/App/actions';
import createFragment from 'react-addons-create-fragment';
// import keyIndex from 'react-key-index';
import './styles.css';


const MedicationTable = (
  {
    puffValue,
    timesPerDayValue,
    doseICSValue,
    patientMedications,
    onSelection,
    puffOnChange,
    timesOnChange,
    doseICSOnChange,
    onSubmit,
    appendMedicationToStack,
    // stack,
  } ) => {

  const headerElements = ["Puff/Time", "Times/Day", "DoseICS", "Select Medication", ""];
  const rowElements = [
    <InputField
      fieldName="puff"
      value={puffValue}
      onChangeInputField={puffOnChange}
    />,
    <InputField
      fieldName="times"
      value={timesPerDayValue}
      onChangeInputField={timesOnChange}
    />,
    <InputField
      fieldName="doseICS"
      value={doseICSValue}
      onChangeInputField={doseICSOnChange}
    />,
    <select
      className="row__select" onChange={onSelection}
      defaultValue={patientMedications}
    >
      <option>-Select Medication-</option>
      <option>ddd</option>
      <option>b</option>
      <option>c</option>
    </select>,
    <button>Delete Row</button>
  ];

  const renderAddRow = () => {
    console.log("Add Row");
    const rowElements = [
      <InputField
        fieldName="puff"
        value={puffValue}
        onChangeInputField={puffOnChange}
      />,
      <InputField
        fieldName="times"
        value={timesPerDayValue}
        onChangeInputField={timesOnChange}
      />,
      <InputField
        fieldName="doseICS"
        value={doseICSValue}
        onChangeInputField={doseICSOnChange}
      />,
      <select
        className="row__select" onChange={onSelection}
        defaultValue={patientMedications}
      >
        <option>-Select Medication-</option>
        <option>ddd</option>
        <option>b</option>
        <option>c</option>
      </select>,
      <button>Delete Row</button>
    ];

    const medicationRow = (<Row key = "" elements={rowElements} />);
    appendMedicationToStack(createFragment({ medicationRow }));
    //add empty inputfield values(puffValue, times, dose) to stack array
  };

  const deleteRow = () => {};

  // stack will have input field information
  // use map to go though stack and output the medicationRow
  // use index of each row as a key
 return (
   <div className="medication-table" onSubmit={onSubmit}>
     <div className="header">
        <Row elements={headerElements} />
     </div>
     {/*
      - maybe create another Row component for medicene rows
      - ul outside and inside the component <li>row</li>
      here:
      stack.map and add information to element tags

     */}
     <div className="main">
       <Row elements={rowElements} />
     </div>
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
  getMedicationToStack: PropTypes.func.isRequired,
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
} );

export default connect(mapStateToProps, mapDispatchToProps)(MedicationTable);