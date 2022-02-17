import React from 'react';
import PropTypes from 'prop-types';

const Minus = ({ onClick }) => {
  return (
    <button onClick={onClick}>&minus;</button>
  );
};

Minus.propTypes = {
  onClick: PropTypes.func,
};

export default Minus;
