import React, { Component } from 'react';


class MedicationRow extends Component{
	render() {
		return (
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
		);
	}
}

export default MedicationRow;