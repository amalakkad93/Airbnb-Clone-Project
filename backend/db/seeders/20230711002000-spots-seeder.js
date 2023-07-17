'use strict';
const { Spot } = require('../models')

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {

    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "567 virgil ave",
        city: "Los Angeles",
        state: "California",
        country: "United States of America",
        lat: 47.7645358,
        lng: -140.4730327,
        name: "Super Cool",
        description: "Place where you can get a hair cut",
        price: 15.00,
      },
      {
        ownerId: 2,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123.00,
      },
      {
        ownerId: 3,
        address: "222 2nd st.",
        city: "Upland",
        state: "California",
        country: "United States of America",
        lat: 20.7645358,
        lng: -150.4730327,
        name: "Whole Food",
        description: "Place where where you can buy organic food",
        price: 50.00,
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }

};
