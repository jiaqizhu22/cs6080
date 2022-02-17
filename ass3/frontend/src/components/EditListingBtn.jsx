import React from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

const EditListingBtn = (listingid) => {
  const navigate = useNavigate();
  const redirect = () => {
    navigate(`/listings/edit/${listingid.listingid}`);
  }
  return (
    <button onClick={redirect}>Edit</button>
  );
};

EditListingBtn.propTypes = {
  listingid: PropTypes.number,
};

export default EditListingBtn;
