import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>EAAPs Escalation Rules</h2>
        </div>
        <div className="patientMedicationRow">
            <label>Enter Information: </label>
            <input type="textfield" placeholder="Puffs Per Time"></input>
            <input type="textfield" placeholder="Times Per Day"></input>
            <input type="textfield" placeholder="Dose ICS"></input>
            <select>
              <option></option>
              <option>a</option>
              <option>b</option>
              <option>c</option>
            </select>
         
          <button>Delete Medication</button>
        </div>
        <button>Add Medication</button>
        <button>Submit</button>
      </div>
    );
  }
}

export default App;
