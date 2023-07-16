const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth");
const { Spot, User, Review, SpotImage, ReviewImage, Booking, sequelize } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");


//*********************handleErrorResponse******************
const errorResponse403 = (err, req, res, next) => {
  res.status(403)
      .setHeader('Content-Type', 'application/json')
      .json({ message: 'Forbidden' })
}
//********************************************************

// Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const { user } = req;

  const findReviewImage = await ReviewImage.findOne({
    where: { id: imageId },
    include: [
      {
        model: Review,
        attributes: ['userId'],
      },
    ]
  })

  if(!findReviewImage) return res.status(404).json({ message: "Review Image couldn't be found" })

  if(findReviewImage && findReviewImage.Review.userId !== req.user.id) next(err)

  const deletedReviewImage = await ReviewImage.destroy({ where: { id: imageId } })
  
  if(deletedReviewImage) return res.status(200).json({ message: "Successfully deleted" })

}, errorResponse403)

module.exports = router;
