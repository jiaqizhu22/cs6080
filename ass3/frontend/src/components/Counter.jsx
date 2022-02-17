import React from 'react';
import Plus from './Plus';
import Minus from './Minus';

const Counter = () => {
  const [value, setValue] = React.useState(0);

  return (
    <div>
      <input type='int' value={value} />
      <Plus onClick={() => setValue(value + 1)}/>
      <Minus onClick={() => setValue(value - 1)}/>
    </div>
  );
};

export default Counter;
