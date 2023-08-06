import ReviewForm from './ReviewForm';

import { useSelector } from 'react-redux';
import {  getSingleReviewThunk, updateReviewThunk } from "../../store/reviews";


const EditReviewForm = ({ reviewId, closeForm }) => {

  const review = useSelector(getSingleReviewThunk(reviewId));

  return (
    <ReviewForm
      review={review}
      formType="Update Review"
      onSubmit={updateReviewThunk}
      closeForm={closeForm}
    />
  );
}

export default EditReviewForm;
