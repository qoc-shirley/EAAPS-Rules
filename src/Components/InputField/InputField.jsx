import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

const InputField = ( {defaultValue, onChangeInputField} ) => {
  //figure out why onChange isn't working
  return (
    <div className="field">
      <div className="field__main">
        <input type="textfield" value={defaultValue} onChange={onChangeInputField} />
      </div>
    </div>
  );
};

InputField.propTypes = {
  defaultValue: PropTypes.string,
  onChangeInputField: PropTypes.func,
};

InputField.defaultProps = {
  defaultValue: '',
};

export default InputField;