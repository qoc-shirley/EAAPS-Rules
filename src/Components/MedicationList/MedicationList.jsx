import React from 'react';
import MedicationRow from '../MedicationRow/MedicationRow.jsx';

const MedicationList = ( props ) => {
  const {
    onDelEvent,
    onSelection,
    puffOnChange,
    timesOnChange,
    doseICSOnChange,
    onSubmit,
  } = props;

 return (
   <div className="app__body" onSubmit={onSubmit}>
     <ul className="header">
       <li>Puffs Per Time</li>
       <li>Times Per Day</li>
       <li>Dose ICS</li>
     </ul>
     <MedicationRow
       onDelEvent={onDelEvent}
       onSelection={onSelection}
       puffOnChange={puffOnChange}
       timesOnChange={timesOnChange}
       doseICSOnChange={doseICSOnChange}/>
   </div>
 );
};

export default MedicationList;