import React from 'react';
import _ from 'lodash';

const Row = ( elements ) => {
  const items = _
    .chain( elements )
      .map( ( element, index ) => (
       <li key={index}>{element}</li>
      ))
    .value();

 return (
   <div className="row">
      <ul>
        {items}
      </ul>
   </div>
  );
};

export default Row;