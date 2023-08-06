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
export const getAllReviews = (reviews) => ({ type: GET_ALL_REVIEWS, reviews });
// export const createReview = (review) =>({ type: CREATE_REVIEW, review});

export const getReviewBySoptId = (review) => ({ type: GET_REVIEW_BY_SOPT_ID, review });

export const getSingleReview = (review) => ({ type: GET_SINGLE_REVIEW, review });
export const updateReview = (review) => ({ type: UPDATE_SINGLE_REVIEW, review});
export const  deleteReview = (id) => ({ type: DELETE_REVIEW, id });

// ************************************************
//                   ****Thunks****
// ************************************************

// ***************************createReview***************************
export const createReview = (reviewToCreate) => async (dispatch) => {
  const req = await fetch(`/api/spots/${reviewToCreate.spotId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ rating: reviewToCreate.rating })
  });
  const data = await req.json();
  const createdReview = data;
  dispatch(getSingleReview(createdReview));
  return createdReview;
};


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
    dispatch(getAllReviews(Reviews));

    // dispatch(getAllSpots(Spots))
    return Reviews;
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
