'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Products', [
      { name: 'Product A', price: 10000, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Product B', price: 15000, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Product C', price: 20000, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Product D', price: 8000, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Product E', price: 18000, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Product F', price: 12000, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Product G', price: 22000, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Product H', price: 11000, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Product I', price: 19000, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Product J', price: 25000, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
