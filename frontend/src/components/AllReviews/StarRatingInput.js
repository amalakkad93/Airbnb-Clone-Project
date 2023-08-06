import React, { useState, useEffect } from 'react';

const StarRatingInput = ({ rating, disabled, onChange }) => {
  const [activeRating, setActiveRating] = useState(rating);

  useEffect(() => {
    setActiveRating(rating);
  }, [rating]);

  const starIcon = (number) => {
    const props = {};
    if (!disabled) {
      props.onMouseEnter = () => setActiveRating(number);
      props.onMouseLeave = () => setActiveRating(rating);
      props.onClick = () => onChange(number);
    }
    return (
      <div key={number} className={activeRating >= number ? 'filled' : 'empty'} {...props}>
        <i className="fa fa-star"></i>
      </div>
    );
  };

  return (
    <div className="rating-input">
      {[1, 2, 3, 4, 5].map(number => starIcon(number))}
    </div>
  );
};

export default StarRatingInput;
