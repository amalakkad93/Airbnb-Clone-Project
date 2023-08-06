import { csrfFetch } from "../src/store/csrf";

// ************************************************
//                   ****types****
// ************************************************
export const GET_ALL_REVIEWS = "/get_all_reviews"; //read. // GET spots/
export const GET_SINGLE_REVIEW = 'reviews/GET_SINGLE_REVIEW';
export const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
export const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

// ************************************************
//                   ****action creator****
// ************************************************
export const getAllReviews = (reviews) => ({ type: GET_ALL_REVIEWS, reviews });
export const getSingleReview = (review) => ({ type: GET_SINGLE_REVIEW, review });
export const updateReview = (review) => ({ type: UPDATE_REVIEW, review });
export const deleteReview = (reviewId) => ({ type: DELETE_REVIEW, reviewId });

export const getReviewDetailThunk = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`);
  if (res.ok) {
    const review = await res.json();
    dispatch(getSingleReview(review));
    return review;
  }
};

export const updateReviewThunk = (updatedReview) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${updatedReview.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedReview)
  });

  if (res.ok) {
    const updatedReviewData = await res.json();
    dispatch(updateReview(updatedReviewData));
    return updatedReviewData;
  }
};

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE"
  });

  if (res.ok) {
    dispatch(deleteReview(reviewId));
    return reviewId;
  }
};

// ************************************************
//                   ****Reducer****
// ************************************************
const initialState = { spot: {}, user: {} };

export default function reviewReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_ALL_REVIEWS:
      // ... Your existing implementation ...
      return newState;

    case GET_SINGLE_REVIEW:
      newState = { ...state, spot: { ...state.spot, [action.review.id]: action.review } };
      return newState;

    case UPDATE_REVIEW:
      newState = { ...state, spot: { ...state.spot, [action.review.id]: action.review } };
      return newState;

    case DELETE_REVIEW:
      newState = { ...state, spot: { ...state.spot } };
      delete newState.spot[action.reviewId];
      return newState;

    default:
      return state;
  }
}
;
export const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
