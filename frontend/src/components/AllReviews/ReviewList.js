import { useSelector } from 'react-redux';
import {  getReviewBySoptIdThunk } from "../../store/reviews";

import ReviewItem from './ReviewItem';

const ReviewList = ({ spotId }) => {
  const reviews = useSelector((state) => state.reviews.spot);
  console.log("========================================",reviews);

  return (
    <ul>
      {reviews.map(review => (
        <li key={review.id} className="review-item">
          <ReviewItem review={review} />
        </li>
      ))}
    </ul>
  );
}

export default ReviewList;
