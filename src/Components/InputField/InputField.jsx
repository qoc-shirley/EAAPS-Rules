import React from 'react';

const InputField = ( props ) => {
  const {
    value,
    onChange,
  } = props;

  return (
    <div className="field">
      <input type="textfield" value={value} onChange={onChange} />
    </div>
  );
};

export default InputField;