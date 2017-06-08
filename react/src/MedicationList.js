import React, { Component } from 'react';
import AddRow from './MedicationRow.js';
import './App.css';

class MedicationList extends Component {
	render() {
		const onDelEvent = this.props.onDelRow;
		const onSelection = this.props.onSelection;

		return (
			<div className="childContainer" onSubmit={this.props.handleSubmit}>
				<div>
          <ul>
            <li>Puffs Per Time</li>
            <li>Times Per Day</li>
            <li>Dose ICS</li>
          </ul>
         </div>

				<AddRow onDelEvent={onDelEvent} onSelection={onSelection} />
        <button onClick={this.props.onAddRow}>Add Row</button>
        <input type="submit" value="Submit" onClick={this.props.onSubmit} />
			</div>
		);
	}
}

export default MedicationList;