// import { useSelector } from "react-redux";
// import { getAllReviewsThunk } from "../../../store/reviews";
// import { useDispatch } from "react-redux";
// import { createReview } from "../../../store/reviews";
// import { useParams } from "react-router-dom";


// import ReviewItem from "./ReviewItem";
// import './ReviewList.css'

// const ReviewList = ({ spotId }) => {
//   const spot = useSelector((state) => state.spots.singleSpot);
//   const reviews = useSelector((state) => state.reviews.spot);
//   const avgRating = spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "N/A";
//   const numberOfReviews = spot.numReviews;
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return date.toLocaleString("en-US", options);
//   };

//     // Get the current logged-in user from Redux state
//     const currentUser = useSelector((state) => state.session.user);

//     // Check if the user has already posted a review for this spot
//     const userHasPostedReview = reviews.some((review) => review.userId === currentUser?.id);

//     // Check if the user is the creator of the spot
//     const userIsSpotCreator = spot?.Owner?.id === currentUser?.id;

//       // Step 1: Get the dispatch function from Redux
//   const dispatch = useDispatch();

//   // Step 2: Define the handlePostReview function
//   const handlePostReview = async () => {
//     // Step 3: Create a new review object with the necessary data
//     const newReview = {
//       spotId: spotId,
//       userId: currentUser.id,
//       review: "This is a new review", // Replace this with the actual review text
//       stars: 5, // Replace this with the actual star rating
//     };

//     try {
//       // Step 4: Dispatch the Redux thunk action to create the review
//       const createdReview = await dispatch(createReview(newReview));

//       // The createReview thunk should return the newly created review,
//       // which you can use if needed (e.g., display a success message)
//       console.log("New review created:", createdReview);

//       // Optionally, you can refresh the list of reviews after creating a new one
//       await dispatch(getAllReviewsThunk(spotId));
//     } catch (error) {
//       // Handle any errors that occurred during the review creation process
//       console.error("Error creating review:", error.message);
//     }
//   };

//   return (
//     <ul>
//              <div className="reviews-container">
//              <h2>{`⭐ ${avgRating} · ${spot.numReviews} reviews`}</h2>
//             {reviews.length >= 1 &&
//               reviews.map((review, index) => (
//                 <>
//                 <div className="review-item" key={index}>
//                   {/* <h3>{index + 1} review</h3> */}
//                   <h3>
//                     {review.User.firstName} {review.User.lastName}
//                   </h3>
//                   <p style={{ fontSize: "1.1rem", color: "grey" }}>
//                     {formatDate(review.createdAt)}</p>
//                   <p>{review.review}</p>
//                   {/* <StarRating rating={review.rating} readOnly /> */}
//                 </div>
//                 </>
//               ))}
//           </div>
//           {/* Conditionally render the "Post Review" button */}
//       {currentUser && !userHasPostedReview && !userIsSpotCreator && (
//         <button onClick={() => handlePostReview()}>Post Review</button>
//       )}
//     </ul>
//   );
// };

// export default ReviewList;

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllReviewsThunk, createReview } from "../../../store/reviews";
import ReviewItem from "./ReviewItem";
import './Reviews.css';
import OpenModalButton from "../../OpenModalButton";
import CreateReviewModal from "../ReviewModals/CreateReviewModal";
import StarsRatingInput from "./StarsRatingInput";
// import {createReview } from '../../../store/reviews';

const GetAllReviews = ({ spotId }) => {
  const spot = useSelector((state) => state.spots.singleSpot);
  const reviews = useSelector((state) => state.reviews.spot);
  const avgRating = spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "N/A";
  const numberOfReviews = spot.numReviews;

  const currentUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleString("en-US", options);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("***************reviews***************", reviews)
    const newReview =  await dispatch(createReview (spotId, review, stars));
  }



  // const showPostReviewButton =
  // currentUser &&
  // !reviews.find((review) => review.userId === currentUser.id) &&
  // currentUser.id !== spot.userId;


  console.log("***************************spotId****************", spot.id);

  return (
    <ul>
      <div className="reviews-container">
        <div className="review-and-post-Review-button">
          <h2>{`⭐ ${avgRating} · ${numberOfReviews} reviews`}</h2>
          <OpenModalButton buttonText="Post Your Review" modalComponent={<CreateReviewModal spotId={spot.id } />} />
        </div>
        {reviews.length >= 1 &&
          reviews.map((review, index) => (
            <div className="review-item" key={index}>
              <h3>
                {review.User.firstName} {review.User.lastName}
              </h3>
              <p style={{ fontSize: "1.1rem", color: "grey" }}>
                {formatDate(review.createdAt)}
              </p>
              <p>{review.review}</p>
            </div>
          ))}
      </div>



      {/* {showPostReviewButton && (
        <button onClick={handlePostReview}>Post Review</button>
      )} */}
    </ul>
  );
};

export default GetAllReviews;
