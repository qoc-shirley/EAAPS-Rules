import React from 'react';
// import _ from 'lodash';
import PropTypes from 'prop-types';
// import InputField from '../InputField/InputField.jsx';
// import Row from '../Row/Row.jsx';
import './styles.css';

const Stack = ( {
                  stack,
                  onAddRow,
                  buttonLabel,
                } ) => {
  console.log("stack: ", stack);
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
  buttonLabel: PropTypes.string.isRequired,
  stack: PropTypes.array.isRequired,
  onAddRow: PropTypes.func.isRequired,
};

Stack.defaultProps = {
  buttonLabel: '',
  stack: [],
};

export default Stack;