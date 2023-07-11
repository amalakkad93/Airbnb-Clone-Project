'use strict';
const { Booking } = require('../models')
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

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
    // options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    // return queryInterface.bulkDelete(options, {
    await queryInterface.bulkDelete('Bookings', {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
