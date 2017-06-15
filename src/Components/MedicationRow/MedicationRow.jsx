import React, { Component } from 'react';
import AddField from '../AddField/AddField.jsx';

class MedicationRow extends Component {
	render() {

    // const {
    //  onChangePuffs,
    //   onChangeTimes,
    //   onDeleteEvent,
    // } = this.props;

    const puffValueOnChange = this.props.onChangePuffs;
    const timesOnChange = this.props.onChangeTimes;
    const doseICSOnChange = this.props.onChangeDose;
    const onDelEvent = this.props.onDelEvent;
    const onSelection = this.props.onSelection;

    return (
			<div className="row">
        <AddField
          fieldName="row__textfield--puff"
          value={this.props.puffValue}
          onChange={puffValueOnChange}
        />

        <AddField
          fieldName="row__textfield--times"
          value={this.props.timesPerDayValue}
          onChange={timesOnChange}
        />

        <AddField
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