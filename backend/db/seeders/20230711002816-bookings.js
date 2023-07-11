'use strict';
const { Booking } = require('../models')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: "2023-07-10",
        endDate: "2023-07-13",
      },
      {
        spotId: 2,
        userId: 2,
        startDate: "2023-08-10",
        endDate: "2023-08-13",
      },
      {
        spotId: 3,
        userId: 3,
        startDate: "2023-09-10",
        endDate: "2023-09-13",
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
