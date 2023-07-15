const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth");
const {
  Spot,
  Booking,
  User,
  Review,
  SpotImage,
  ReviewImage,
  sequelize,
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const spot = require("../../db/models/spot");
const { json } = require("sequelize");

const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true }),
  check("endDate")
    .isAfter(new Date().toISOString())
    .withMessage("endDate cannot come before startDate"),
  handleValidationErrors,
];

const errorResponse403 = (err, req, res, next) => {
  res.status(403)
      .setHeader('Content-Type', 'application/json')
      .json({ message: 'Forbidden' })
}

router.get("/current", requireAuth, async (req, res) => {
  const allBookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
          {
              model: Spot,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              include: [
                  {
                      model: SpotImage,
                  },
              ],
          },
      ],
  });

  const bookings = allBookings.map((booking) => {
      const bookingJSON = booking.toJSON();

      const previewImage = bookingJSON.Spot.SpotImages.find((spotImage) => spotImage.preview);
      bookingJSON.Spot.previewImage = previewImage ? previewImage.url : null;

      delete bookingJSON.Spot.SpotImages;

      return {
          id: bookingJSON.id,
          spotId: bookingJSON.spotId,
          Spot: bookingJSON.Spot,
          userId: bookingJSON.userId,
          startDate: bookingJSON.startDate,
          endDate: bookingJSON.endDate,
          createdAt: bookingJSON.createdAt,
          updatedAt: bookingJSON.updatedAt,
      };
  });

  res.json({Bookings: bookings});
});

//======== Edit a Booking ========
// router.put("/:bookingId", requireAuth, async (req, res) => {
//   const bookingId = req.params.bookingId;
//   const { startDate, endDate } = req.body;

//   const booking = await Booking.findByPk(bookingId);

//   if (!booking) return res.status(404).json({ message: "Booking couldn't be found" });
//   const currentDate = new Date();
//   if (new Date(booking.startDate) < currentDate || new Date(booking.endDate) < currentDate) return res.status(403).json({ message: "Past bookings can't be modified" });
//   if (endDate < startDate) {
//       return res.status(400).json({
//           message: "Bad Request",
//           errors: {
//               endDate: "endDate cannot come before startDate"
//           }
//       })
//   }
//   const oldBooking = await Booking.findOne({
//       where: {
//           spotId: spotId,
//           [Op.or]: [
//               {
//                   startDate: {
//                       [Op.between]: [startDate, endDate],
//                   },
//               },
//               {
//                   endDate: {
//                       [Op.between]: [startDate, endDate],
//                   },
//               },
//               {
//                   [Op.and]: [
//                       { startDate: { [Op.lte]: startDate } },
//                       { endDate: { [Op.gte]: endDate } },
//                   ],
//               },
//           ],
//       },
//   });
//   if (oldBooking) {
//       return res.status(403).json({
//           message: "Sorry, this spot is already booked for the specified dates",
//           errors: {
//               startDate: "Start date conflicts with an existing booking",
//               endDate: "End date conflicts with an existing booking"
//           }
//       });
//   }

//   else {
//       const updatedBooking = await booking.update({ startDate, endDate });
//       res.json(updatedBooking);
//   }
// });

// router.put("/:bookingId", async (req, res) => {
//   const bookingId = req.params.bookingId;
//   const { startDate, endDate } = req.body;
//   const booking = await Booking.findByPk(bookingId);
//   const updatedBooking = await booking.update({ startDate, endDate });

//   if (booking && booking.userId !== req.user.id) {
//       return res.status(403).json({
//           message: "Forbidden"
//       })
//   }
//   if (!booking) return res.status(404).json({ message: "Booking couldn't be found" });
//   let currentDate = new Date();
//   if (new Date(booking.endDate).toISOString() < currentDate) {
//       return res.status(403).json({ message: "Past bookings can't be modified" });
//   }
//   if (endDate < startDate) {
//       return res.status(400).json({
//           message: "Bad Request",
//           errors: {
//               endDate: "endDate cannot come before startDate"
//           }
//       })
//   }
//   // const oldBooking = await Booking.findOne({
//   //     where: {
//   //         spotId: spotId,
//   //         [Op.or]: [
//   //             {
//   //                 startDate: {
//   //                     [Op.between]: [startDate, endDate],
//   //                 },
//   //             },
//   //             {
//   //                 endDate: {
//   //                     [Op.between]: [startDate, endDate],
//   //                 },
//   //             },
//   //             {
//   //                 [Op.and]: [
//   //                     { startDate: { [Op.lte]: startDate } },
//   //                     { endDate: { [Op.gte]: endDate } },
//   //                 ],
//   //             },
// //         ],
//   //     },
//   // });
//   // if (oldBooking) {
//   //     return res.status(403).json({
//   //         message: "Sorry, this spot is already booked for the specified dates",
//   //         errors: {
//   //             startDate: "Start date conflicts with an existing booking",
//   //             endDate: "End date conflicts with an existing booking"
//   //         }
//   //     });
//   // }



//   res.json(updatedBooking);
// });

router.put("/:bookingId", requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;
  const { startDate, endDate } = req.body;
  const booking = await Booking.findByPk(bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  if (booking.userId != req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const currentDate = new Date();
  if (new Date(booking.endDate) < currentDate) {
    return res.status(403).json({ message: "Past bookings can't be modified" });
  }

  if (endDate < startDate) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        endDate: "endDate cannot come before startDate",
      },
    });
  }

  const updatedBooking = await booking.update({ startDate, endDate });
  res.json(updatedBooking);
});

//======== Delete a Booking ========
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;
  const { user } = req;

  const bookingOwner = await  Booking.findByPk(bookingId)

  const bookedReview = await  Booking.destroy({ where: { id: bookingId, userId: req.user.id } })

  if(!bookingOwner) return res.status(404).json({ message: "Review couldn't be found" })
  else if(bookedReview) return res.status(200).json({ message: "Successfully deleted" })
  else if(bookingOwner && bookingOwner.reviewId !== req.user.id) next(err)
}, errorResponse403)

// router.get("/current", requireAuth, async (req, res) => {
//   const bookings = await Booking.findAll({
//     where: { userId: req.user.id },
//     include: [
//       {
//         model: Spot,
//         attributes: { exclude: ["createdAt", "updatedAt"] },
//         include: [
//           {
//             model: SpotImage,
//             // attributes: ["id", "url", "preview"],
//           },
//         ],
//       },
//     ],
//   });
//   const reviews = bookings.map((booking) => {
//     const bookingJSON = booking.toJSON();

//     const previewImage = bookingJSON.Spot.SpotImages.find((spotImage) => spotImage.preview);
//     bookingJSON.Spot.previewImage = previewImage ? previewImage.url : null;

//     delete bookingJSON.Spot.SpotImages;

//     return {
//         id: bookingJSON.id,
//         spotId: bookingJSON.spotId,
//         spot: bookingJSON.Spot,
//         userId: bookingJSON.userId,
//         startDate: bookingJSON.startDate,
//         endDate: bookingJSON.endDate,
//         createdAt: bookingJSON.createdAt,
//         updatedAt: bookingJSON.updatedAt,
//     };
// });

// res.json({ reviews });
// });
//=================================
  // const reviews = bookings.map((booking) => {
  //   const bookingJSON = booking.toJSON();

  //   const previewImage = bookingJSON.Spot.SpotImages.find( (spotImage) => spotImage.preview );
  //   bookingJSON.Spot.previewImage = previewImage ? previewImage.url : null;

  //   // spots.previewImage = previewImage;

  //   delete bookingJSON.Spot.SpotImages;

  //   return bookingJSON.Spot;
  // });

  // const data = {};
  // data.booking = {
  //   id: bookings.id,
  //   spotId: bookings.spotId,
  //   spot: reviews,
  //   userId: bookings.userId,
  //   startDate: bookings.startDate,
  //   endDate: bookings.endDate,
  //   createdAt: bookings.createdAt,
  //   updatedAt: bookings.updatedAt,
  // };
  // res.json(data);



//======== Edit a Booking ========
// router.put("/:bookingId", requireAuth, async (req, res) => {
//   const bookingId = req.params.bookingId;
//   const { startDate, endDate } = req.body;

//   const booking = await Booking.findByPk(bookingId);

//   if (!booking) {
//     return res.status(404).json({ message: "Booking couldn't be found" });
//   } else if (booking.userId !== req.user.id) {
//     return res.status(403).json({ message: "Past bookings can't be modified" });
//   } else if (new Date(endDate) < new Date()) {
//     return res.status(403).json({ message: "Can't edit a booking that's past the end date" });
//   }

//   const updatedBooking = await booking.update({ startDate, endDate });
//   res.json(updatedBooking);
// });




module.exports = router;
