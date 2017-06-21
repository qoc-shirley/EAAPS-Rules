import React from 'react';
//import MedicationRow from '../MedicationRow/MedicationRow.jsx';
import InputField from '../InputField/InputField.jsx';
import Row from '../Row/Row.jsx';


const MedicationList = (
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

     <div className="row__header">
        <Row elements={["Puff/Time", "Times/Day", "DoseICS"]} />
     </div>

     <div className="row__main" >
        <Row elements={
          <div>
          <InputField
            fieldName="puff"
            defaultValue={puffValue}
            onChangeInputField={puffOnChange}
          />
          <InputField
          fieldName="times"
          defaultValue={timesPerDayValue}
          onChangeInputField={timesOnChange}
          />
          <InputField
          fieldName="doseICS"
          defaultValue={doseICSValue}
          onChangeInputField={doseICSOnChange}
          />
          </div>
        }/>
     </div>

   </div>
 );
};

export default MedicationList;