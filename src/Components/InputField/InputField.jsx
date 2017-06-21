import React from 'react';

const InputField = ( props ) => {
  const {
    value,
    onChange,
  } = props;

  return (
    <div className="field">
      <div className="field_main">
        <input type="textfield" value={value} onChange={onChange} />
      </div>
    </div>
  );
};

export default InputField;