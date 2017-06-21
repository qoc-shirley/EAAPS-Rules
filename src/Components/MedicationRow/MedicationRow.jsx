import React from 'react';
import InputField from '../InputField/InputField.jsx';

const MedicationRow = ( props ) => {

  const {
    onDelEvent,
    onSelection,
    puffOnChange,
    timesOnChange,
    doseICSOnChange,
    puffValue,
    timesPerDayValue,
    doseICSValue,
    patientMedications,
  } = props;

  return (
    <div className="row">
      <InputField
        fieldName="row__textfield--puff"
        value={puffValue}
        onChange={puffOnChange}
      />

      <InputField
        fieldName="row__textfield--times"
        value={timesPerDayValue}
        onChange={timesOnChange}
      />

      <InputField
        fieldName="row__body__textfield--doseICS"
        value={doseICSValue}
        onChange={doseICSOnChange}
      />

      <select className="row__select" value={patientMedications} onChange={onSelection}>
        <option>-Select Medication-</option>
        <option>ddd</option>
        <option>b</option>
        <option>c</option>
      </select>

      <div className="row__button">
        <button onClick={onDelEvent}>Delete Row</button>
      </div>
      </div>
   );
};

export default MedicationRow;