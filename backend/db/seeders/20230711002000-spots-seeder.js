// 'use strict';
// const { Spot } = require('../models')

// /** @type {import('sequelize-cli').Migration} */

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA; // define your schema in options object
// }

// module.exports = {
//   async up (queryInterface, Sequelize) {

//     await Spot.bulkCreate([
//       {
//         ownerId: 1,
//         address: "567 virgil ave",
//         city: "Los Angeles",
//         state: "California",
//         country: "United States of America",
//         lat: 47.7645358,
//         lng: -140.4730327,
//         name: "Super Cool",
//         description: "Place where you can get a hair cut",
//         price: 15.00,
//       },
//       {
//         ownerId: 2,
//         address: "123 Disney Lane",
//         city: "San Francisco",
//         state: "California",
//         country: "United States of America",
//         lat: 37.7645358,
//         lng: -122.4730327,
//         name: "App Academy",
//         description: "Place where web developers are created",
//         price: 123.00,
//       },
//       {
//         ownerId: 3,
//         address: "222 2nd st.",
//         city: "Upland",
//         state: "California",
//         country: "United States of America",
//         lat: 20.7645358,
//         lng: -150.4730327,
//         name: "Whole Food",
//         description: "Place where where you can buy organic food",
//         price: 50.00,
//       },
//     ], { validate: true })
//   },

//   async down (queryInterface, Sequelize) {

//     options.tableName = 'Spots';
//     const Op = Sequelize.Op;
//     return queryInterface.bulkDelete(options, {
//       ownerId: { [Op.in]: [1, 2, 3] }
//     }, {});
//   }

// };

'use strict';
const { Spot } = require('../models');
const bcrypt = require("bcryptjs");


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: 'ownerHasId1andSpotIdis1',
        city: 'Atlanta',
        state: 'Georgia',
        country: 'USA',
        lat: 50.45,
        lng: 70.30,
        name: 'SpotBelongsToUser1SpotId1',
        description: 'really pretty',
        price: 20.00,
      },
      {
        ownerId: 2,
        address: 'ownerIsId2andSpotIdis3',
        city: 'Spring Hill',
        state: 'Kansas',
        country: 'USA',
        lat: 20.45,
        lng: 30.30,
        name: 'SpotBelongsToUser2spotId3',
        description: 'its ok',
        price: 50.47,
      },
      {
        ownerId: 3,
        address: 'OwnerIsId3andSpotisId4',
        city: 'St. Louis',
        state: 'Missouri',
        country: 'USA',
        lat: 90.15,
        lng: 100.20,
        name: 'SpotBelongsToUser3spotId4',
        description: 'its ugly',
        price: 100.47,
      },
    ], { validate: true });
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },


  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
     ownerId: { [Op.in]: [1,2,3] }
    }, {});
  }
};
