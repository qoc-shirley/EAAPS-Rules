import React, { Component } from 'react';
import './App.css';

class MedicationList extends Component {

	render() {
		return (
			<div>
				<table onSubmit={this.handleSubmit} className="patientMedicationRow">
          <thead>
            <tr>
              <td>Puffs Per Time</td>
              <td>Times Per Day</td>
              <td>Dose ICS</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input type="textfield" value={this.state.puffValue} onChange={this.props.handlePuffOnChange} />
              </td>
              <td>
                <input type="textfield" value={this.state.timesPerDayValue} onChange={this.props.handleTimesOnChange} />
              </td>
              <td>
                <input type="textfield" value={this.state.doseICSValue} onChange={this.props.handleDoseICSOnChange} />
              </td>
              <select value={this.state.patientMedications} onChange={this.handleMedicationSelection}>
                <option>-Select Medication-</option>
                <option>a</option>
                <option>b</option>
                <option>c</option>
              </select>
              <td>
                <button onClick={this.handleDeleteRow}>Delete Row</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button onClick={this.handleAddRow}>Add Row</button>
        <input type="submit" value="Submit" onClick={this.handleSubmit} />
			</div>
		);
	}
}

export default MedicationList;