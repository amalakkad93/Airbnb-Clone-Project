// components/ReviewModals/CreateReviewModal.js
import React from 'react';
import { useModal } from '../../context/Modal';
import CreateReview from './CreateReview';

const CreateReviewModal = ({ spotId }) => {
  const { closeModal } = useModal();

  return (
    <>
      <h2>How was your stay?</h2>
      <div className="review-form-container">
        <CreateReview spotId={spotId} />
      </div>
    </>
  );
};

export default CreateReviewModal;
