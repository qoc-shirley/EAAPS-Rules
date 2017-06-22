import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import InputField from '../InputField/InputField.jsx';
import Row from '../Row/Row.jsx';
import './styles.css';

const Stack = ( {
                  onDelete,
                  onSelection,
                  patientMedications,
                  puffValue,
                  timesPerDayValue,
                  doseICSValue,
                  doseICSOnChange,
                  puffOnChange,
                  timesOnChange} ) => {
  let stack = [];//passed in as props

  /*removeRowAtIndex(){

  }*/

  const renderAddRow = () => {
    console.log("Add Row");
    const rowElements = [
      <InputField
        fieldName="puff"
        defaultValue={puffValue}
        onChangeInputField={puffOnChange}
      />,
      <InputField
        fieldName="times"
        defaultValue={timesPerDayValue}
        onChangeInputField={timesOnChange}
      />,
      <InputField
        fieldName="doseICS"
        defaultValue={doseICSValue}
        onChangeInputField={doseICSOnChange}
      />,
      <select
        className="row__select"
        onChange={onSelection}
        value={patientMedications}
      >
        <option>-Select Medication-</option>
        <option>ddd</option>
        <option>b</option>
        <option>c</option>
      </select>,
      <button onClick={onDelete}>Delete Row</button>
    ];


      stack.push(
        <div className="main" >
          <h1>row</h1>
          <Row elements={rowElements} />
        </div>);

  };

  return (
    <div className="stack">
      {stack}
      <button className="body__button--add" onClick={renderAddRow}>Add Row</button>
    </div>
  );
};

Stack.propTypes = {

};

Stack.defaultProps = {

};

export default Stack;