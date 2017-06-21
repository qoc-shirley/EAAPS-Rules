import React from 'react';

const Row = ( elements ) => {
  const items = elements.map((element) => (<li>{element}</li>));

 return (
   <div className="row">
      <ul>
        {items}
      </ul>
   </div>
  );
};

export default Row;