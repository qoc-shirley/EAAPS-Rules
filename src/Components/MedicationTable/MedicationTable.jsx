import React from 'react';
//import MedicationRow from '../MedicationRow/MedicationRow.jsx';
import InputField from '../InputField/InputField.jsx';
import Row from '../Row/Row.jsx';
import PropTypes from 'prop-types';


const MedicationTable = (
  {
    puffValue,
    timesPerDayValue,
    doseICSValue,
    onDelEvent,
    onSelection,
    puffOnChange,
    timesOnChange,
    doseICSOnChange,
    onSubmit,
  } ) => {

 return (
   <div className="app__body" onSubmit={onSubmit}>
     {/*<ul className="header">
       <li>Puffs Per Time</li>
       <li>Times Per Day</li>
       <li>Dose ICS</li>
     </ul>
     <MedicationRow
       onDelEvent={onDelEvent}
       onSelection={onSelection}
       puffOnChange={puffOnChange}
       timesOnChange={timesOnChange}
       doseICSOnChange={doseICSOnChange}/>*/}

     <div className="header">
        <Row elements={["Puff/Time", "Times/Day", "DoseICS"]} />
     </div>

     <div className="main" >
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
          onChangeInputField={doseICSOnChange}/>
        ]}/>
     </div>
   </div>
 );
};

Row.propTypes = {
  puffValue: PropTypes.string,
  timesPerDayValue: PropTypes.string,
  doseICSValue: PropTypes.string,
  onDelEvent: PropTypes.func,
  onSelection: PropTypes.func,
  puffOnChange: PropTypes.func,
  timesOnChange: PropTypes.func,
  doseICSOnChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

Row.defaultProps = {
  puffValue: '',
  timesPerDayValue: '',
  doseICSValue: '',
};

export default MedicationTable;