import React from 'react';
import { useNavigate } from 'react-router';

const CreateListingBtn = (e) => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate('/listings/create');
  }
  return (
    <button onClick={handleClick}>Add New Listing</button>
  );
};

export default CreateListingBtn;
