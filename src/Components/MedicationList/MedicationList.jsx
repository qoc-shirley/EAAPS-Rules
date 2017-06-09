import React, { Component } from 'react';
import AddRow from '../MedicationRow/MedicationRow.jsx';


class MedicationList extends Component {
	render() {
		const onDelEvent = this.props.onDelRow;
		const onSelection = this.props.onSelection;
		const onSubmit = this.props.onSubmit;
		const onAddRow = this.props.onAddRow;

		return (
			<div className="gridContainer" onSubmit={onSubmit}>
        <ul>
          <li>Puffs Per Time</li>
          <li>Times Per Day</li>
          <li>Dose ICS</li>
        </ul>
				<AddRow onDelEvent={onDelEvent} onSelection={onSelection} />
        <button onClick={onAddRow}>Add Row</button>
        <input type="submit" value="Submit" onClick={onSubmit} />
			</div>
		);
	}
}

export default MedicationList;