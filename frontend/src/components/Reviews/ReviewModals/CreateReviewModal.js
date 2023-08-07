
import ReviewForm from './ReviewForm';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useModal} from '../../../context/Modal';
import {createReviewThunk, getSingleReview } from '../../../store/reviews';
import OpenModalButton from "../../OpenModalButton";
// import StarsRatingInput from '../GetAllReviews/StarsRatingInput';
import './CreateReviewModal.css';


export default function  CreateReviewModal({ spotId, setReloadPage}){
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [stars, setStars] = useState(0);
    const [review, setReview] = useState('');

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handelCreateReview = () => {
        dispatch(createReviewThunk(spotId, review, stars))
            .then(() => {
                closeModal();
            })
            .catch(async (error) => {
                const data = await error.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                } else {
                    setMessage(data.message);
                }
            });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('');
    }

    const handleStarClick = (starValue) => {
        setStars(starValue);
        updateSubmitButtonDisabled(starValue, review);
    };

    const handleReviewChange = (e) => {
        const review = e.target.value;
        setReview(e.target.value);
        updateSubmitButtonDisabled(stars, review);
    };

    const updateSubmitButtonDisabled = (star, createdReview) => {
        setSubmitButtonDisabled(!(star >= 1 && createdReview.length >= 10));
    }

    return (
        <div>
            <form onSubmit={handleSubmit} id='form-review'>
                <h2>How was your stay?</h2>
                <div>
                    {message && <div className="error">{message}</div>}
                </div>
                <textarea
                    placeholder="Leave your review here..."
                    type="text"
                    name="review"
                    value={review}
                    onChange={handleReviewChange}
                />
                {errors.review && <div className="error">{errors.review}</div>}
                <p className="star-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span  key={star} onClick={() => handleStarClick(star)}>⭐</span>
                    ))}<span>Stars</span>
                </p>
                {errors.stars && <div className="error">{errors.stars}</div>}
                <button id="submit-review-btn" onClick={handelCreateReview} disabled={submitButtonDisabled} >Submit your Review</button>
            </form>
        </div>
    );
}



// export default function CreateReviewModal({ spotId, setReloadPage}) {

//   const { closeModal, setOnModalClose } = useModal();
//   const dispatch = useDispatch();
//   const [review, setReview] = useState("");
//   const [stars, setStars] = useState(0.0);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [validationObj, setValidationObj] = useState({});
//   const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);


//   const spot = useSelector((state) => state.spots.singleSpot);
//   const reviews = useSelector((state) => state.reviews.spot);
//   const currentUser = useSelector((state) => state.session.user);
//   const avgRating = spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "N/A";
//   const numberOfReviews = spot.numReviews;
//   const starNum = [1, 2, 3, 4, 5].map((star) => (<span key={star}>⭐</span>));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       return dispatch(createReviewThunk(spotId, review, stars))
//       .then(setReloadPage(true))
//       .then(closeModal());
//     } catch (error) {
//       console.error("*******Error creating review:", error);
//     }
//   };
//   const handleStarClick = (star) => {
//     setStars(star);
//     submitButtonDisabled(star, review);
// };

//   useEffect(() => {
//     const errorsObj = {};

//     if (!review || review.length < 10) errorsObj.review = 'At least 10 characters required';
//     if (!Number.isInteger(Number(stars)) || (stars < 1 || stars > 5)) errorsObj.stars = 'Stars must be an integer number between 1 and 5';

//     setValidationObj(errorsObj);
//   }, [review, stars]);



//   return (
//     <>
//     <h1>{spotId}</h1>
//     <h2>How was your stay?</h2>
//     <div className="review-form-container">
//       <form onSubmit={handleSubmit} id ="form-review">
//       <textarea
//             type="text"
//             id="review"
//             value={review}
//             placeholder="Leave your review here..."
//             onChange={(e) => setReview(e.target.value)}
//           />
//           {validationObj.review && <p style={{ color: 'red' }}>{validationObj.review}</p>}

//           {/* <div className="rating-container"><StarsRatingInput/></div> */}
//           {/* <div className="rating-container"><StarsRatingInput/></div> */}
//           <p className="star-container">
//                     {[1, 2, 3, 4, 5].map((star) => (<span key={star}  onClick={() => handleStarClick(star)}>⭐</span>))}<span>Stars</span>
//                     </p>
//           <input
//             type="text"
//             id="starRate"
//             placeholder="Out of 1-5 stars, how many?"
//             onChange={(e) => setStars(e.target.value)}
//             required
//             />
//             {validationObj.stars && <p style={{ color: 'red' }}>{validationObj.stars}</p>}

//           <label htmlFor="starRate">Stars</label>

//           <button className="review-form-btn" type="submit" disabled={Object.keys(validationObj).length > 0}>
//           Submit Your Review
//           </button>
//           {/* <button type="submit">Submit Your Review</button> */}
//       </form>
//     </div>

//     </>

//   );
// }
