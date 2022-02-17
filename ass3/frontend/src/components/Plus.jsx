import React from 'react';
import PropTypes from 'prop-types';

const Plus = ({ onClick }) => {
  return (
    <button onClick={onClick}>+</button>
  );
};

Plus.propTypes = {
  onClick: PropTypes.func,
};

export default Plus;
