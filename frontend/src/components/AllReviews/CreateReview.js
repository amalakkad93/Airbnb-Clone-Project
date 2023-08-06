// components/CreateReview.js
// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { createReviewThunk } from '../../store/reviews';

// const CreateReview = ({ spotId, closeForm }) => {
//   const dispatch = useDispatch();
//   const [review, setReview] = useState('');
//   const [stars, setStars] = useState(0.0);
//   const [validationObj, setValidationObj] = useState({});

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newReview = await dispatch(createReviewThunk(spotId, review, stars));

//   };

//   useEffect(() => {
//     const errorsObj = {};
//     if (!review || review.length < 10) errorsObj.review = 'At least 10 characters required';
//     if (!Number.isInteger(Number(stars)) || stars < 1 || stars > 5) errorsObj.stars = 'Stars must be an integer number between 1 and 5';
//     setValidationObj(errorsObj);
//   }, [review, stars]);

//   return (
//     <>
//       <form onSubmit={handleSubmit}>
//         <textarea
//           type="text"
//           id="review"
//           value={review}
//           onChange={(e) => setReview(e.target.value)}
//         />
//         {validationObj.review && <p style={{ color: 'red' }}>{validationObj.review}</p>}
//         <input
//           type="text"
//           id="starRate"
//           placeholder="Out of 1-5 stars, how many?"
//           onChange={(e) => setStars(e.target.value)}
//           required
//         />
//         {validationObj.stars && <p style={{ color: 'red' }}>{validationObj.stars}</p>}
//         <label htmlFor="starRate">Stars</label>
//         <button type="submit" disabled={Object.keys(validationObj).length > 0}>
//           Submit Your Review
//         </button>
//       </form>
//     </>
//   );
// };

// export default CreateReview;
// components/CreateReview.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createReviewThunk } from '../../store/reviews';
import ReviewForm from './ReviewForm';

const CreateReview = ({ spotId, closeForm }) => {
  const newReview = {spotId, stars : 0.0};
  return (
    <>
    <ReviewForm
      newReview={newReview}
      formType="Submit Review"
      onSubmit={createReviewThunk}
      closeForm={closeForm}
    />
    </>
  );
}
export default CreateReview;
