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
          <button>Delete Medication</button>
          <select>
          </select>
          <label>Enter: </label>
          <input type="textfield" placeholder="Puffs Per Time"></input>
          <input type="textfield" placeholder="Times Per Day"></input>
          <input type="textfield" placeholder="Dose ICS"></input>
        </div>
          <p><button>Add Medication</button></p>
          <p><button type="submit">Submit</button></p>
      </div>
    );
  }
}

export default App;
