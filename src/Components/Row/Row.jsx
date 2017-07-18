import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './styles.css';

const Row = ( { children } ) => {
  const items = _
    .chain( children )
      .map( ( element, index ) => (
        <li key={index}>{element}</li>
      ) )
    .value();

  return (
    <div className="row">
      {items}
    </div>
  );
};

Row.propTypes = {
  children: PropTypes.array,
};

Row.defaultProps = {
  children: null,
};

export default Row;
