import React from 'react';
import PropTypes from 'prop-types';

const PublishBtn = (listingid) => {
  const publish = () => {
    window.location.reload(false);
  };
  return (
    <button onClick={publish}>Publish</button>
  );
};

PublishBtn.propTypes = {
  listingid: PropTypes.number,
};

export default PublishBtn;
