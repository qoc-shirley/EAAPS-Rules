import React from 'react';
import InputField from '../InputField/InputField.jsx';

const MedicationRow = ( props ) => {

  /*const {
    onDelEvent,
    onSelection,
    puffOnChange,
    timesOnChange,
    doseICSOnChange,
    puffValue,
    timesPerDayValue,
    doseICSValue,
    patientMedications,
  } = props;*/

    return (
			<div className="row">
        <InputField
          fieldName="row__textfield--puff"
          value={props.puffValue}
          onChange={props.puffOnChange}
        />

        <InputField
          fieldName="row__textfield--times"
          value={props.timesPerDayValue}
          onChange={props.timesOnChange}
        />

        <InputField
          fieldName="row__body__textfield--doseICS"
          value={props.doseICSValue}
          onChange={props.doseICSOnChange}
        />

        <select className="row__select" value={props.patientMedications} onChange={props.onSelection}>
          <option>-Select Medication-</option>
          <option>ddd</option>
          <option>b</option>
          <option>c</option>
        </select>

        <div className="row__button">
          <button onClick={props.onDelEvent}>Delete Row</button>
        </div>
      </div>
		);
};

export default MedicationRow;