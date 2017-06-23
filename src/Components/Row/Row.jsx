import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import './styles.css';

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

Row.propTypes = {
  elements: PropTypes.array,
};

Row.defaultProps = {
  elements: null,
};

export default Row;