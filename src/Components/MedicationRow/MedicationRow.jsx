import React, { Component } from 'react';
import InputField from '../InputField/InputField.jsx';

class MedicationRow extends Component {
	render() {

    // const {
    //  onDelEvent,
    //   onSelection,
    //   puffOnChange,
    //   timesOnChange,
    //   doseICSOnChange,
    // } = this.props;

    const puffValueOnChange = this.props.onChangePuffs;
    const timesOnChange = this.props.onChangeTimes;
    const doseICSOnChange = this.props.onChangeDose;
    const onDelEvent = this.props.onDelEvent;
    const onSelection = this.props.onSelection;

    return (
			<div className="row">
        <InputField
          fieldName="row__textfield--puff"
          value={this.props.puffValue}
          onChange={puffValueOnChange}
        />

        <InputField
          fieldName="row__textfield--times"
          value={this.props.timesPerDayValue}
          onChange={timesOnChange}
        />

        <InputField
          fieldName="row__body__textfield--doseICS"
          value={this.props.doseICSValue}
          onChange={doseICSOnChange}
        />

        <select className="row__select" value={this.props.patientMedications} onChange={onSelection}>
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
	}
}

export default MedicationRow;