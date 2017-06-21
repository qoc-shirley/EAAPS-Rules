import React from 'react';

const InputField = ( {value, onChange} ) => {

  return (
    <div className="field">
      <div className="field_main">
        <input type="textfield" value={value} onChange={onChange} />
      </div>
    </div>
  );
};

export default InputField;