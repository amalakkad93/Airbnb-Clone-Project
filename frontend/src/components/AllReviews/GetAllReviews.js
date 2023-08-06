// components/GetAllReviews.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CreateReviewModal from "./CreateReviewModal";

import './Reviews.css'

const GetAllReviews = ({ spotId }) => {
  const spot = useSelector((state) => state.spots.singleSpot);
  const reviews = useSelector((state) => state.reviews.spot);
  const avgRating = spot.avgStarRating ? spot.avgStarRating.toFixed(1) : 'N/A';
  const numberOfReviews = spot.numReviews;
  const [showForm, setShowForm] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleString("en-US", options);
  };
  const toggleFormVisibility = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  return (
    <ul>
      <div className="reviews-container">
        <div className="review-and-post-Review-button">
          <h2>{`⭐ ${avgRating} · ${numberOfReviews} reviews`}</h2>
          <button onClick={toggleFormVisibility}>Post Your Review</button>
          {showForm && <CreateReviewModal spotId={spotId} />} 
        </div>
        {reviews.length >= 1 &&
          reviews.map((review, index) => (
            <div className="review-item" key={index}>
              <h3>
                {review.User.firstName} {review.User.lastName}
              </h3>
              <p style={{ fontSize: '1.1rem', color: 'grey' }}>{formatDate(review.createdAt)}</p>
              <p>{review.review}</p>
            </div>
          ))}
      </div>
    </ul>
  );
};

export default GetAllReviews;
