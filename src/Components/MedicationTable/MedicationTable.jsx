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
    onDelEvent,
    patientMedications,
    onSelection,
    puffOnChange,
    timesOnChange,
    doseICSOnChange,
    onSubmit,
  } ) => {

 return (
   <div className="app__body" onSubmit={onSubmit}>
     <div className="header">
        <Row elements={["Puff/Time", "Times/Day", "DoseICS", "Select Medication", "   "]} />
     </div>

     {/* <div className="main" >
        <Row elements={[
          <InputField
          fieldName="puff"
          defaultValue={puffValue}
          onChangeInputField={puffOnChange}/>,
          <InputField
          fieldName="times"
          defaultValue={timesPerDayValue}
          onChangeInputField={timesOnChange}/>,
          <InputField
          fieldName="doseICS"
          defaultValue={doseICSValue}
          onChangeInputField={doseICSOnChange}/>,
          <select className="row__select" value={patientMedications} onChange={onSelection}>
            <option>-Select Medication-</option>
            <option>ddd</option>
            <option>b</option>
            <option>c</option>
          </select>,
          <button onClick={onDelEvent}>Delete Row</button>
        ]}/>
     </div>*/}
     <Stack
       onDelete={onDelEvent}
       onSelection={onSelection}
       puffOnChange={puffOnChange}
       timesOnChange={timesOnChange}
       doseICSOnChange={doseICSOnChange}
      />
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