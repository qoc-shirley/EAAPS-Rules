import React from 'react';

const InputField = ( {defaultValue, onChangeInputField} ) => {

  return (
    <div className="field">
      <div className="field_main">
        <input type="textfield" value={defaultValue} onChange={onChangeInputField} />
      </div>
    </div>
  );
};

export default InputField;