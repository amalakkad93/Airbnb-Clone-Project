// components/ReviewForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createReviewThunk } from "../../store/reviews";
import StarRatingInput from './StarRatingInput';
import './Reviews.css'

// const ReviewForm = ({ spotId }) => {
//   const dispatch = useDispatch();
//   const [review, setReview] = useState('');
//   const [stars, setStars] = useState(0.0);
//   const [validationObj, setValidationObj] = useState({});

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newReview = await dispatch(createReviewThunk(spotId, review, stars));
//     // Handle any errors or further logic after review creation
//   };

//   useEffect(() => {
//     const errorsObj = {};
//     if (!review || review.length < 10) errorsObj.review = 'At least 10 characters required';
//     if (!Number.isInteger(Number(stars)) || stars < 1 || stars > 5) errorsObj.stars = 'Stars must be an integer number between 1 and 5';
//     setValidationObj(errorsObj);
//   }, [review, stars]);

//   return (
//     <>
//       <h1>{spotId}</h1>
//       <h2>How was your stay?</h2>
//       <div className="review-form-container">
//         <form onSubmit={handleSubmit}>
//           <textarea
//             type="text"
//             id="review"
//             value={review}
//             onChange={(e) => setReview(e.target.value)}
//           />
//           {validationObj.review && <p style={{ color: 'red' }}>{validationObj.review}</p>}
//           <input
//             type="text"
//             id="starRate"
//             placeholder="Out of 1-5 stars, how many?"
//             onChange={(e) => setStars(e.target.value)}
//             required
//           />
//           {validationObj.stars && <p style={{ color: 'red' }}>{validationObj.stars}</p>}
//           <label htmlFor="starRate">Stars</label>
//           <button type="submit" disabled={Object.keys(validationObj).length > 0}>
//             Submit Your Review
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default ReviewForm;


const ReviewForm = ({ review, formType, onSubmit, closeForm }) => {
  const [stars, setStars] = useState(review.stars);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // IMPORTANT: Need to await this, otherwise the closeForm will happen first
    // and the review will get updated at the same time as closing form. the
    // review will not get updated after form is closed.
    await dispatch(onSubmit({ ...review, stars }));
    closeForm();
  };

  const onChange = (number) => {
    setStars(parseInt(number));
  };

  return (
    <form onSubmit={handleSubmit} >
      <StarRatingInput
        disabled={false}
        onChange={onChange}
        stars={stars}
      />
      <input type="submit" value={formType} />
      <button onClick={closeForm}>Cancel</button>
    </form>
  );
}


export default ReviewForm;
