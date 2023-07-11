'use strict';
const { SpotImage } = require('../models')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "/images/bathroom",
        preview: true
      },
      {
        spotId: 2,
        url: "/images/livingroom",
        preview: true
      },
      {
        spotId: 3,
        url: "/images/masterroom",
        preview: true
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
