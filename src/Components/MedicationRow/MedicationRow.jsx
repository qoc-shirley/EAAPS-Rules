import React, { Component } from 'react';


class MedicationRow extends Component {
	render() {
    const puffValueOnChange = this.props.onChangePuffs;
    const timesOnChange = this.props.onChangeTimes;
    const doseICSOnChange = this.props.onChangeDose;
    const onDelEvent = this.props.onDelEvent;
    const onSelection = this.props.onSelection;

    return (
			<div className="body__row">
        <div className="body__textfield--puff">
          <input type="textfield" value={this.props.puffValue} onChange={puffValueOnChange} />
        </div>
        <div className="body__textfield--times">
          <input type="textfield" value={this.props.timesPerDayValue} onChange={timesOnChange} />
        </div>
        <div className="body__textfield--doseICS">
          <input type="textfield" value={this.props.doseICSValue} onChange={doseICSOnChange} />
        </div>
        <select className="body__select" value={this.props.patientMedications} onChange={onSelection}>
          <option>-Select Medication-</option>
          <option>ddd</option>
          <option>b</option>
          <option>c</option>
        </select>
        <div className="body__button--delete">
          <button onClick={onDelEvent}>Delete Row</button>
        </div>
      </div>
		);
	}
}

export default MedicationRow;