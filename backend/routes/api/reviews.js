const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, ReviewImage,  sequelize } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");

const validateReview = [
  check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
  check('stars')
      .isIn([1, 2, 3, 4, 5])
      .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
];

// ======== Get all Reviews of the Current User ========
router.get("/current", requireAuth, async (req, res) => {
  const reviewList = await Review.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: SpotImage,
            attributes: ["id", "url", "preview"],
          },
        ],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
    where: { userId: req.user.id },
  });

  const reviews = reviewList.map((review) => {
    const reviewJSON = review.toJSON();

    const previewImage = reviewJSON.Spot.SpotImages.find( (spotImage) => spotImage.preview );
    reviewJSON.Spot.previewImage = previewImage ? previewImage.url : null;

    delete reviewJSON.Spot.SpotImages;

    return reviewJSON;
  });
  res.json({ Reviews: reviews });
});

// Add an Image to a Review based on the Review's id
// Edit a Review
// Delete a Review





module.exports = router;
