// import {useDispatch} from 'react-redux';
import { csrfFetch } from "./csrf";

// ************************************************
//                   ****types****
// ************************************************
const GET_ALL_REVIEWS = "/get_all_reviews"; //read. // GET spots/
const GET_REVIEW_BY_SOPT_ID = "/GET_REVIEW_BY_SOPT_ID"; //SPOT_DETAIL // "spots/getSpotDetail"
const GET_SINGLE_REVIEW = "/get_single_review"; //SPOT_DETAIL // "spots/getSpotDetail"
const UPDATE_SINGLE_REVIEW = "UPDATE_SINGLE_review";
const DELETE_REVIEW = "DELETE_REVIEW";
const CREATE_REVIEW = "CREATE_REVIEW";

// ************************************************
//                   ****action creator****
// ************************************************
export const getReviews = (reviews) => ({ type: GET_ALL_REVIEWS, reviews });
export const createReview = (review) =>({ type: CREATE_REVIEW, review});

export const getReviewBySoptId = (review) => ({ type: GET_REVIEW_BY_SOPT_ID, review });

export const getSingleReview = (review) => ({ type: GET_SINGLE_REVIEW, review });
export const updateReview = (review) => ({ type: UPDATE_SINGLE_REVIEW, review});
export const  deleteReview = (id) => ({ type: DELETE_REVIEW, id });

//********************************************************************************************************************************************************************* */
export const getAllReviews = state => state?.reviews ? Object.values(state.reviews) : [];
export const getReviewsForSpot = SpotId => state => state?.reviews ? Object.values(state.reviews).filter(review => review.spotId === SpotId) : [];
export const getReview = reviewId => state => state?.reviews ? state.reviews[reviewId] : null;
//********************************* *************************************************************************************************************************************/

// ************************************************
//                   ****Thunks****
// ************************************************

// ***************************createReview***************************
// export const createReviewThunk = (spotId, reviewToCreate, stars) => async (dispatch) => {
//   // const req = await fetch(`/api/spots/${reviewToCreate.spotId}/reviews`, {


//   const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
//     method: "POST",
//     headers: {"Content-Type": "application/json"},
//     body: JSON.stringify({ review: reviewToCreate, stars })
//   });
//   if (res.ok) {
//   const data = await res.json();
//   const createdReview = data;
//   dispatch(getSingleReview(createdReview));
//   return createdReview;
//   // dispatch(getSingleReview(data.reviewToCreate));
//   // return res;
//   } else {
//     throw res;
//   }

// };


export const createReviewThunk = (spotId, review, stars) => async (dispatch) => {
  try {
    console.log("*******Creating review...", spotId, review, stars);
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ review, stars }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.ok) {
      const data = await res.json();
      console.log("*******Review created:", data.review);
      dispatch(createReview(data.review));
    } else {
      console.error("*******Error response:", res);
      throw res;
    }
  } catch (error) {
    console.error("*******Error creating review:", error);
    throw error;
  }
};


// export const createReviewThunk = (reviewToCreate) => async (dispatch) => {
//   // const req = await fetch(`/api/spots/${reviewToCreate.spotId}/reviews`, {
//   const req = await csrfFetch(`/api/spots/${reviewToCreate.spotId}/reviews`, {
//     method: "POST",
//     headers: {"Content-Type": "application/json"},
//     body: JSON.stringify({ stars: reviewToCreate.stars })
//   });
//   if (req.ok) {
//   const data = await req.json();
//   const createdReview = data;
//   dispatch(getSingleReview(createdReview));
//   return createdReview;
//   }

// };


// ***************************getAllReviewsThunk**************************
// these functions hit routes
export const getAllReviewsThunk = (spotId) => async (dispatch) => {
  // const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const res = await fetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const { Reviews } = await res.json(); // { Spots: [] }
    // do the thing with this data
    // dispatch(getAllReviews(normalizeArr(Reviews)));
    console.log("In res.ok in thunk", Reviews)
    dispatch(getReviews(Reviews));

    // dispatch(getAllSpots(Spots))
    return Reviews;
  } else {
    const errors = await res.json();
    return errors;
  }
};

// ***************************getReviewBySoptIdThunk**************************
// these functions hit routes
export const getReviewBySoptIdThunk = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const { Reviews } = await res.json(); // { Spots: [] }
    // do the thing with this data
    // dispatch(getAllReviews(normalizeArr(Reviews)));
    console.log("In res.ok in thunk", Reviews)
    dispatch(getReviewBySoptId(Reviews));

    // dispatch(getAllSpots(Spots))
    return Reviews;
  } else {
    const errors = await res.json();
    return errors;
  }
};

// ***************************getSingleReviewThunk**************************
// these functions hit routes
export const getSingleReviewThunk = (reviewId) => async (dispatch) => {
  const res = await fetch(`/api/reviews/${reviewId}`);

  if (res.ok) {
    const { review } = await res.json(); // { Spots: [] }
    // do the thing with this data
    // dispatch(getAllReviews(normalizeArr(Reviews)));
    console.log("In res.ok in thunk", review)
    dispatch(getSingleReview(review));

    // dispatch(getAllSpots(Spots))
    return review;
  } else {
    const errors = await res.json();
    return errors;
  }
};

// ***************************updateReviewThunk**************************
// these functions hit routes
export const updateReviewThunk = (review) => async (dispatch) => {
  const res = await fetch(`/api/reviews/${review.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(review)
  });

  if (res.ok) {
    const { review } = await res.json(); // { Spots: [] }
    // do the thing with this data
    // dispatch(getAllReviews(normalizeArr(Reviews)));
    console.log("In res.ok in thunk", review)
    dispatch(updateReview(review));

    // dispatch(getAllSpots(Spots))
    return review;
  } else {
    const errors = await res.json();
    return errors;
  }
};

// ***************************deleteReviewThunk**************************
// these functions hit routes
export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  const res = await fetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(reviewId)
  });

  if (res.ok) {
    const { review } = await res.json(); // { Spots: [] }
    // do the thing with this data
    // dispatch(getAllReviews(normalizeArr(Reviews)));
    console.log("In res.ok in thunk", review)
    dispatch(deleteReview(review));

    // dispatch(getAllSpots(Spots))
    return review;
  } else {
    const errors = await res.json();
    return errors;
  }
};



// ***************************normalizeArr**************************
function normalizeArr(reviews) {
  const normalizedReviews = {};
  reviews.forEach((review) => (normalizedReviews[reviews.id] = review));
  return normalizedReviews;
}

// ************************************************
//                   ****Reducer****
// ************************************************
const initialState = { spot: {}, user: {} };


export default function reviewReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_ALL_REVIEWS:
      newState = { ...state, spot: {} };
      newState.spot = action.reviews;
      // normalize this array into state
      // newState = structuredClone(state);
      // action.spots.forEach((spot) => {
      // 	newState.allSpots[spot.id] = spot;
      // });
      return newState;
    case GET_REVIEW_BY_SOPT_ID:
      newState = { ...state, spot: {} };
      newState.spot = action.reviews;
      return newState;
    // case GET_SINGLE_REVIEW:
    //   newState = { ...state, singleSpot: {} };
    //   newState.singleSpot = action.spot;
    //   return newState;

    // case UPDATE_SINGLE_REVIEW:
    //   // newState = { ...state, singleSpot: {} };
    //   newState = { ...state, singleSpot: {} };
    //   newState.singleSpot = action.spot;
    //   return newState;
    // case DELETE_REVIEW:
    //   newState = { ...state, singleSpot: {} };
    //   newState.singleSpot = {};
    //   delete newState.allSpots[action.id];
    //   return newState;
    // case CREATE_REVIEW:
    //   // newState = { ...state, singleSpot: {} };
    //   newState = { ...state };
    //   // newState.allSpots[action.spot.id] = action.spot;
    //   newState.singleSpot = action.spot;
    //   return newState;

    default:
      return state;
  }
}
