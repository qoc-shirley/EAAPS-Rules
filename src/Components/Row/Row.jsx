import React from 'react';
import _ from 'lodash';
// import createFragment from 'react-addons-create-fragment';

const Row = ( {elements} ) => {
  console.log(elements);

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