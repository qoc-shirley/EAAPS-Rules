import React from 'react';
// import _ from 'lodash';
import PropTypes from 'prop-types';
import InputField from '../InputField/InputField.jsx';
import Row from '../Row/Row.jsx';
import './styles.css';

const Stack = ( {
                  onAddRow,
                  buttonLabel,
                } ) => {
  let stack = [<h1 key={0} >hi</h1>];//passed in as props

  return (
    <div className="stack">
      <div className="stack__contents">
        {stack}
      </div>
      <button
        className="button__addRow"
        onClick={onAddRow}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

Stack.propTypes = {

};

Stack.defaultProps = {

};

export default Stack;