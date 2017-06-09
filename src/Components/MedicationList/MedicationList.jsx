import React, { Component } from 'react';
import AddRow from '../MedicationRow/MedicationRow.jsx';


class MedicationList extends Component {
	render() {
		const onDelEvent = this.props.onDelRow;
		const onSelection = this.props.onSelection;
		const puffOnChange = this.props.puffOnChange;
    const timesOnChange = this.props.timesOnChange;
    const doseICSOnChange = this.props.doseICSOnChange;
		const onSubmit = this.props.onSubmit;

		return (
			<div className="app__body" onSubmit={onSubmit}>
        <ul className="body__header">
          <li>Puffs Per Time</li>
          <li>Times Per Day</li>
          <li>Dose ICS</li>
        </ul>
				<AddRow
          onDelEvent={onDelEvent}
          onSelection={onSelection}
          onChangePuffs={puffOnChange}
          onChangeTimes={timesOnChange}
          onChangeDose={doseICSOnChange} />
			</div>
		);
	}
}

export default MedicationList;