import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotDetailThunk } from "../../../store/spots";
// import { getAllReviewsThunk } from "../../../store/reviews";
import { getAllReviews } from "../../../store/reviews";
import { useParams, Link } from "react-router-dom";
import StarRating from "../../StarRating/StarRating";

import "./SpotDetail.css";

export default function SpotDetail() {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(3.5);
  const sessionUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.singleSpot);
  const reviews = useSelector((state) => state.reviews.spot);

  const [currentIndex, setCurrentIndex] = useState(0);
  const { spotId } = useParams();

  useEffect(() => {
    dispatch(getSpotDetailThunk(spotId));
    dispatch(getAllReviewsThunk(spotId));
  }, [dispatch, spotId]);

  // const spotImagesPreviewFalse = spot.spotImages.filter((image) => image.preview === false);

  if (!spot.id) return null;
  if (!spot) {
    return <div>Loading...</div>;
  }

  const displayEditBtn = () => sessionUser && sessionUser.id === spot.userId;
  const handleRatingChange = (newRating) => {
    // Handle the rating change here (e.g., update it in the state)
    setRating(newRating);
  };

  // console.log("*********Reviews = ", reviews)
  // console.log("*********avg = ", typeof spot.avgStarRating)
  // if(!reviews) return null

  if (!reviews || reviews.length === 0) {
    return <p>No reviews available for this spot.</p>;
  }

  return (
    <>
      <div className='tile-parent'>
        <div className='name-Location-container'>
          <h2>{spot.name}</h2>
          <div className='location-container'>
            <span className='location'>{`${spot.city}, ${spot.state}, ${spot.country}`}</span>
          </div>
        </div>
        <div className="spot-images-and-below-details-containers">
          <div className='spot-images-containers'>
            <div className="left-spot-image-container">
              <img className="resize" src={spot.SpotImages[0]?.url} alt={spot.name} />
            </div>
            <div className="right-spot-image-container">
              <div className="right-side-spot-image-container">
                {spot.SpotImages?.slice(1, 5).map((image, index) => (
                  <div className="right-image" key={index}>
                    <img className="resize" src={image.url} alt={`Image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="details-container">
          <div className='owner-details-container'>
            <h1>Hosted by, {spot.User && spot.User.firstName} {spot.User && spot.User.lastName}</h1>
          </div>
          <div className="reviews-info-and-rating-container">
            <p style={{ margin: "0.2rem", fontSize: "1rem", color: "var(--black)" }}>
              <span style={{ fontWeight: "600", fontSize: 20 }}>${spot.price}</span> night
            </p>
            {/* <div className="spot-detail-below-container"> */}
            <div className="spot-number-of-reviews-and-rating-container">
             {/* { spot.avgStarRating && (<StarRating rating={ spot.avgStarRating && (spot.avgStarRating.toFixed(1))} changeRating={handleRatingChange} />)} */}
              <p>{`${spot.numReviews} reviews`}</p>
            </div>
            <button type="button" onClick={()=> alert("Feature Coming Soon...")}>Reserve</button>
          </div>
          <div className="spot-description-container">
            <h2>About this spot</h2>
            <div>
            <p>{spot.description}</p>

            </div>
          </div>
          <div className="reviews-container">
  {/* {

  reviews.length >= 1 && reviews.toReversed().map((review, index) => (
    <div className="review-item" key={index}>
      <h3>Review {index + 1}</h3>
      <p>{review.review}</p>
      <StarRating rating={review.rating} readOnly />
    </div>
  ))} */}
</div>
          </div>
        {/* </div> */}
      </div>
    </>
  );
}
