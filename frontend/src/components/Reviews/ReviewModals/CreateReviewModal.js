
import ReviewForm from './ReviewForm';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useModal} from '../../../context/Modal';
import {createReviewThunk, getSingleReview } from '../../../store/reviews';
import OpenModalButton from "../../OpenModalButton";
// import StarsRatingInput from '../GetAllReviews/StarsRatingInput';

export default function CreateReviewModal({ spotId, setReloadPage}) {
  const { closeModal, setOnModalClose } = useModal();
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0.0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [validationObj, setValidationObj] = useState({});


  const spot = useSelector((state) => state.spots.singleSpot);
  const reviews = useSelector((state) => state.reviews.spot);
  const currentUser = useSelector((state) => state.session.user);
  const avgRating = spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "N/A";
  const numberOfReviews = spot.numReviews;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      return dispatch(createReviewThunk(spotId, review, stars))
      .then(setReloadPage(true))
      .then(closeModal());
    } catch (error) {
      console.error("*******Error creating review:", error);
    }
  };

  useEffect(() => {
    const errorsObj = {};

    if (!review || review.length < 10) errorsObj.review = 'At least 10 characters required';
    if (!Number.isInteger(Number(stars)) || (stars < 1 || stars > 5)) errorsObj.stars = 'Stars must be an integer number between 1 and 5';

    setValidationObj(errorsObj);
  }, [review, stars]);

  return (
    <>
    <h1>{spotId}</h1>
    <h2>How was your stay?</h2>
    <div className="review-form-container">
      <form onSubmit={handleSubmit}>
      <textarea
            type="text"
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          {validationObj.review && <p style={{ color: 'red' }}>{validationObj.review}</p>}

          {/* <div className="rating-container"><StarsRatingInput/></div> */}
          {/* <div className="rating-container"><StarsRatingInput/></div> */}
          <input
            type="text"
            id="starRate"
            placeholder="Out of 1-5 stars, how many?"
            onChange={(e) => setStars(e.target.value)}
            required
            />
            {validationObj.stars && <p style={{ color: 'red' }}>{validationObj.stars}</p>}

          <label htmlFor="starRate">Stars</label>

          <button className="review-form-btn" type="submit" disabled={Object.keys(validationObj).length > 0}>
          Submit Your Review
          </button>
          {/* <button type="submit">Submit Your Review</button> */}
      </form>
    </div>

    </>

  );
}
