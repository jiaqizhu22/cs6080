import React from 'react';
import PropTypes from 'prop-types';

const ListingBox = ({ title, thumbnail, price, metadata, reviews }) => {
  const type = metadata.propertyType;
  const bedrooms = metadata.bedrooms ? metadata.bedrooms : [];
  const reviewNo = reviews.length;
  return (
    <div>
      <h2>{title}</h2>
      <h3>Property Type: {type}</h3>
      {bedrooms.map((bedroom, idx) => (
        <div key={idx}>
          <p>Bedroom {idx + 1}</p>
          <div>
            <span>Beds: { bedroom.beds }</span>
            <span> Bathrooms: { bedroom.bathrooms }</span>
          </div>
        </div>
      ))}
      <div>Image: <img src={thumbnail} alt={title + '.thumbnail'}/></div>
      <div>SVG Rating: </div>
      <p>Number of total reviews: {reviewNo}</p>
      <p>Price(per night): $ {price}</p>
    </div>
  )
};

ListingBox.propTypes = {
  title: PropTypes.string,
  thumbnail: PropTypes.string,
  price: PropTypes.any,
  metadata: PropTypes.any,
  reviews: PropTypes.any,
};

export default ListingBox;
