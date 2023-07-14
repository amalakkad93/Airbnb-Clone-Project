const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, ReviewImage, sequelize } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required.'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 49 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Price per day is required'),
  handleValidationErrors
];

const validateReview = [
  check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
  check('stars')
      .isIn([1, 2, 3, 4, 5])
      .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
];

//======== Get all Spots ========
router.get("/", async (req, res) => {

  const spots = await Spot.findAll({

    include: [
      {
        model: Review,
        attributes: ['stars']
      },
      {
        model: SpotImage,
        attributes: ['url', 'preview']
      },
    ]
  });

  let spotsList = processSpots(spots)
  res.json(spotsList);
})

//======== Get all Spots owned by the Current User ========
router.get('/current', requireAuth, async (req, res) => {

  const spots = await Spot.findAll({
    include: [
      { model: Review, attributes: ["stars"] },
      { model: SpotImage, attributes: ["url", "preview"] }
    ]
  });

  let spotsList = processSpots(spots)
  res.json(spotsList);
})

// ======== Get details of a Spot from an id ========
router.get('/:spotId', async (req, res) => {
  const spotId = req.params.spotId;

  const spot = await Spot.findByPk(spotId, {
    include: [
      { model: Review },
      { model: SpotImage, attributes: ['id', 'url', 'preview'] },
      { model: User, attributes: ['id', 'firstName', 'lastName'] }
    ]
  });

  if (spot) {
    const numReviews = spot.Reviews.length;
    const avgStarRating = spot.Reviews.reduce((sum, review) => sum + review.stars, 0) / numReviews;

    const response = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews,
      avgStarRating,
      SpotImages: spot.SpotImages,
      User: spot.User
    };

    return res.json(response);
  } else {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
});

//======== Create a Spot ========
router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  if(user) {

    const spot = await Spot.create({ ownerId: user.id, address, city, state, country, lat, lng, name, description, price });

    const newSpot = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
    };

    res.json(newSpot);

  } else {
    res.status(400).json({ message: 'Forbidden' });
  }
});

//======== Add an Image to a Spot based on the Spot's id ========
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const spotId = req.params.spotId;

  const spot = await Spot.findOne({ where: { id: spotId, ownerId: req.user.id } });

  if (spot) {
    const spotImage = await SpotImage.create({ spotId, url, preview });

        const { updatedAt, createdAt, ...response } = spotImage.toJSON();
        delete response.spotId;

        return res.json(response);

  } else {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
});

//======== Edit a Spot ========
router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {

  const spotId = req.params.spotId;

  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const spot = await Spot.findOne({ where: { id: spotId, ownerId: req.user.id } });

  if(spot) {
    const updatedSpot = await spot.update({ address, city, state, country, lat, lng, name, description, price });
    res.json(updatedSpot);
  } else {
    res.status(400).json({ message: 'Forbidden' });
  }
});

//======== Delete a Spot ========
router.delete('/:spotId', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const { user } = req;

  const deletedSpot = await Spot.destroy({ where: { id: spotId, ownerId: req.user.id } })

  if(!deletedSpot) return res.status(404).json({ message: "Spot couldn't be found" })

  return res.json({ message: "Successfully deleted" })

})

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
  const options = {
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url'],
      },
    ],
    where: { spotId: req.params.spotId },
  };
  const reviews = await Review.findAll(options);

  if (reviews.length === 0) {
    return res.status(404).json({ message: 'Spot not found' });
  }

  const updatedReviews = reviews.map((review) => {
    const reviewJSON = review.toJSON();
    if (reviewJSON.Spot) {
      reviewJSON.Spot.previewImage = reviewJSON.Spot.SpotImages[0]?.url || null;
      delete reviewJSON.Spot.SpotImages;
    }
    return reviewJSON;
  });

  res.json({ Reviews: updatedReviews });
});

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
  const { review, stars } = req.body;
  const spotId = req.params.spotId;
  const userId = req.user.id;

  const oldReview = await Review.findOne({ where: { userId: req.user.id, spotId: req.params.spotId } });
  if (oldReview) {
      return res.status(500).json({
          message: "User already has a review for this spot"
      })
  }

  const spot = await Spot.findOne({ where: { id: spotId } });

  if (spot) {
      const newReview = await Review.create({ userId, spotId, review, stars });

      return res.json(newReview);

  } else if (res.status(404)) {
      return res.status(404).json({ message: "Spot couldn't be found" })
  }

});


//***********Helper functions***********
  const processSpots = (spots) => {

      return spots.map((spot) => {

      spot = spot.toJSON();

      const avgRating = spot.Reviews.reduce((sum, review) => sum + review.stars, 0) / spot.Reviews.length;

      const previewImage = spot.SpotImages.find((image) => image.preview === true);

      spot.avgRating = avgRating || 0;
      spot.previewImage = previewImage ? previewImage.url : "No spot image found";

      delete spot.Reviews;
      delete spot.SpotImages;

      return spot;
    });
  }
   //*********************************

module.exports = router;
