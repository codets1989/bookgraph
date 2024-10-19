'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add categoryId column to the Books table
    await queryInterface.addColumn('Books', 'categoryId', {
      type: Sequelize.INTEGER,
      allowNull: true,  // You can set this to true if it's optional
      references: {
        model: 'Categories', // Name of the Categories table
        key: 'id',           // Key in Categories that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Books', 'categoryId');
  }
};
