import React, { Component } from 'react';
import AddRow from './MedicationRow.js';
import './App.css';

class MedicationList extends Component {
	render() {
		const onDelEvent = this.props.onDelRow;
		const onSelection = this.props.onSelection;

		return (
			<div>
				<table onSubmit={this.props.handleSubmit} className="patientMedicationRow">
          <thead>
            <tr>
              <td>Puffs Per Time</td>
              <td>Times Per Day</td>
              <td>Dose ICS</td>
            </tr>
          </thead>
          <tbody>
        		<AddRow onDelEvent={onDelEvent} onSelection={onSelection} />
          </tbody>
        </table>
        <button onClick={this.props.onAddRow}>Add Row</button>
        <input type="submit" value="Submit" onClick={this.props.onSubmit} />
			</div>
		);
	}
}

export default MedicationList;