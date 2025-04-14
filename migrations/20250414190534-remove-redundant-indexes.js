'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const indexes = await queryInterface.showIndex('users');
    for (const index of indexes) {
      if (index.name !== 'PRIMARY') { // Keep primary key
        await queryInterface.removeIndex('users', index.name);
      }
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
