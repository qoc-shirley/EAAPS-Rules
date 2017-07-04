import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

const InputField = ( { defaultValue, onChangeInputField, placeholder } ) => {

  return (
    <div className="field">
      <div className="field__main">
        <input
          type="textfield"
          value={defaultValue}
          onChange={onChangeInputField}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

InputField.propTypes = {
  defaultValue: PropTypes.string,
  onChangeInputField: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

InputField.defaultProps = {
  placeholder: '',
};

export default InputField;