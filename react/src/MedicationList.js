import React, { Component } from 'react';
import './App.css';

class MedicationList extends Component {

	render() {
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
            <tr>
              <td>
                <input type="textfield" value={this.props.puffValue} onChange={this.props.puffOnChange} />
              </td>
              <td>
                <input type="textfield" value={this.props.timesPerDayValue} onChange={this.props.timesOnChange} />
              </td>
              <td>
                <input type="textfield" value={this.props.doseICSValue} onChange={this.props.doseICSOnChange} />
              </td>
              <select value={this.props.patientMedications} onChange={this.props.onSelection}>
                <option>-Select Medication-</option>
                <option>a</option>
                <option>b</option>
                <option>c</option>
              </select>
              <td>
                <button onClick={this.props.onDelEvent}>Delete Row</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button onClick={this.props.onAddEvent}>Add Row</button>
        <input type="submit" value="Submit" onClick={this.props.onSubmit} />
			</div>
		);
	}
}

export default MedicationList;