import React from 'react';
import { getLocalStorageValue } from '../hooks/useLocalStorage';
import PropTypes from 'prop-types';

const DeleteListingBtn = ({ listingid }) => {
  const token = getLocalStorageValue('token');

  const deleteListing = async () => {
    try {
      const r = await fetch(`http://localhost:5005/listings/${listingid}`, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer ' + token
        },
      });
      if (!r.ok) {
        throw Error(r.statusText);
      }
      window.location.reload(false);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <button onClick={deleteListing}>Delete</button>
  );
};

DeleteListingBtn.propTypes = {
  listingid: PropTypes.number,
};

export default DeleteListingBtn;
