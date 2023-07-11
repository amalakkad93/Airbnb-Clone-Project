'use strict';

const { Spot } = require('../models')
const { Review } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
        {
          userId: 1,
          spotId: 1,
          review: "This was an awesome spot!",
          stars: 5
        },
        {
          userId: 2,
          spotId: 2,
          review: "This was worst spot!",
          stars: 2
        },
        {
          userId: 3,
          spotId: 3,
          review: "It is over rated spot!",
          stars: 3
        }
      ], { validate: true })
    },


  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
