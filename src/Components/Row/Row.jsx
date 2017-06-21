import React from 'react';

const Row = (
  {
    onDelEvent, onSelection, puffOnChange, timesOnChange, doseICSOnChange, onSubmit
  } ) => {

 return (
   <div className="row" onSubmit={onSubmit}>
     <ul className="row__content">
       <li></li>
       <li></li>
       <li></li>
     </ul>
  );
};

export default Row;