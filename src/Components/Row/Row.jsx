import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
// import createFragment from 'react-addons-create-fragment';
// import keyIndex from 'react-key-index';


import './styles.css';

const Row = ( {elements} ) => {
  // console.log("elements: ",elements);

  // const uniqueKey = keyIndex(elements,1);
  // console.log("elements with UniqueId: ", uniqueKey );
  const items = _
    .chain( elements )
      .map( ( element, index ) => (
       <li key={index}>{element}</li>
      ))
    .value();
  // console.log("elements: ", items);
 return (
   <div className="row">
      <ul>
        {items}
      </ul>
   </div>
  );
};

Row.propTypes = {
  elements: PropTypes.array,
};

Row.defaultProps = {
  elements: null,
};

export default Row;