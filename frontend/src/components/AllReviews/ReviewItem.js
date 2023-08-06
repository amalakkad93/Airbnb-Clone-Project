import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteReviewThunk } from "../../store/reviews";
import EditReviewForm from './EditReviewForm';
import StarRatingInput from './StarRatingInput';

const ReviewList = ({ review }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const dispatch = useDispatch();

  return (
    showEditForm ? (
      <EditReviewForm reviewId={review.id} closeForm={() => setShowEditForm(false)} />
    ) : (
      <>
        <StarRatingInput t rating={review.rating} disabled={true} />
        <button onClick={() => setShowEditForm(true)}>Edit</button>
        <button onClick={() => dispatch(deleteReviewThunk(review.id))}>Delete</button>
      </>
    )
  );
}

export default ReviewList;
