import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

const HomeListingBox = ({ id, title, thumbnail, price }) => {
  const navigate = useNavigate();
  const redirect = () => {
    navigate(`/listings/${id}`);
  };
  return (
    <div>
      <h2 className='home' onClick={redirect}>{title}</h2>
      <img src={thumbnail} alt={title + '.thumbnail'}/>
      <div>SVG Rating: </div>
      <p>Number of total reviews: </p>
      <span>Price(per night): $ {price}</span>
    </div>
  )
};

HomeListingBox.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  thumbnail: PropTypes.string,
  price: PropTypes.any,
};

export default HomeListingBox;
