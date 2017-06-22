import React from 'react';
import PropTypes from 'prop-types';
import InputField from '../InputField/InputField.jsx';
import Row from '../Row/Row.jsx';
import Stack from '../Stack/Stack.jsx';
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
  } ) => {

  const headerElements = ["Puff/Time", "Times/Day", "DoseICS", "Select Medication", ""];

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

    return(
      <div className="main" >
        <Row elements={rowElements} />
      </div>
    );
  };

  const deleteRow = () => {};

 return (
   <div className="medication-table" onSubmit={onSubmit}>
     <div className="header">
        <Row elements={headerElements} />
     </div>
     <div className="main">
       <Stack
        onAddRow={renderAddRow}
        onDelete={deleteRow}
        buttonLabel="Add Row"
        />
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
};

MedicationTable.defaultProps = {
  puffValue: '',
  timesPerDayValue: '',
  doseICSValue: '',
};

export default MedicationTable;