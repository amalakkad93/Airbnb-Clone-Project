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

const errorResponse403 = (err, req, res, next) => {
  res.status(403)
      .setHeader('Content-Type', 'application/json')
      .json({ message: 'Forbidden' })
}

// ======== Get all Reviews of the Current User ========
// router.get("/current", requireAuth, async (req, res) => {
//   const reviewList = await Review.findAll({
//     include: [
//       {
//         model: User,
//         attributes: ["id", "firstName", "lastName"],
//       },
//       {
//         model: Spot,
//         attributes: {
//           exclude: ["description", "createdAt", "updatedAt"],
//         },
//         include: [
//           {
//             model: SpotImage,
//             attributes: ["id", "url", "preview"],
//           },
//         ],
//       },
//       {
//         model: ReviewImage,
//         attributes: ["id", "url"],
//       },
//     ],
//     where: { userId: req.user.id },
//   });

  // const reviews = reviewList.map((review) => {
  //   const reviewJSON = review.toJSON();

  //   const previewImage = reviewJSON.Spot.SpotImages.find( (spotImage) => spotImage.preview );
  //   reviewJSON.Spot.previewImage = previewImage ? previewImage.url : null;

  //   delete reviewJSON.Spot.SpotImages;

  //   return reviewJSON;
  // });
  // res.json({ Reviews: reviews });
  // const reviews = reviewList.map((review) => {
  //   const reviewJSON = review.toJSON();

  //   const previewImage = reviewJSON.Spot.SpotImages.find(
  //     (spotImage) => spotImage.preview
  //   );
  //   reviewJSON.Spot.previewImage = previewImage ? previewImage.url : null;

  //   delete reviewJSON.Spot.SpotImages;

  //   return reviewJSON;
  // });

  // res.json({ Reviews: reviews });
// });


//Get all reviews by current user
//Get all reviews by current user
router.get('/current', requireAuth, async (req, res) => {
  const reviewList = await Review.findAll({
      include: [
          {
              model: User,
              attributes: ['id', 'firstName', 'lastName']
          },
          {
              model: Spot,
              attributes: {
                  exclude: ['description', 'createdAt', 'updatedAt']
              },
              include: [
                  {
                      model: SpotImage,
                      attributes: ['id', 'url', 'preview']
                  }
              ]
          },
          {
              model: ReviewImage,
              attributes: ['id', 'url']
          }
      ],
      where: { userId: req.user.id }
  })


  let dudesReviews = [];
  reviewList.forEach(review => {
      dudesReviews.push(review.toJSON())
      dudesReviews.forEach(review => {
          review.Spot.SpotImages.forEach(spotImage => {
              if (spotImage.preview) {
                  review.Spot.previewImage = spotImage.url
              }
          })
          delete review.Spot.SpotImages
      })

      res.json({ Reviews: dudesReviews })
    })
});


// Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const image = req.body.url;
  const reviewId = req.params.reviewId;

  const review = await Review.findByPk(reviewId, {
    include: [{ model: ReviewImage }]
  });

  if (!review) return res.status(404).json({ message: "Review couldn't be found" });
  if (review.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  if (review.ReviewImages.length > 10) return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
  const reviewImage = await ReviewImage.create({ reviewId: review.id, url: image });
  res.json(reviewImage);
});

// Edit a Review
router.put("/:reviewId", requireAuth, validateReview, async (req, res) => {

  const reviewId = req.params.reviewId;

  const { userId, spotId, review, stars } = req.body;
  const reviews = await Review.findOne({ where: { id: reviewId } });

  if(!reviews) return res.status(404).json({ message: "Review couldn't be found" });
  else if (reviews && reviews.userId !== req.user.id) next(err);

  const updatedReview = await review.update({ review, stars });
  res.json(updatedReview);

}, errorResponse403);

//======== Delete a Review ========
router.delete('/:spotId', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const { user } = req;

  const reviewOwner = await Review.findByPk(reviewId)

  const deletedReview = await Review.destroy({ where: { id: reviewId, userId: req.user.id } })

  if(!reviewOwner) return res.status(404).json({ message: "Review couldn't be found" })
  else if(deletedReview) return res.status(200).json({ message: "Successfully deleted" })
  else if(reviewOwner && reviewOwner.reviewId !== req.user.id) next(err)
}, errorResponse403)

module.exports = router;
