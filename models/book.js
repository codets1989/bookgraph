'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
      });
    }
  }
  Book.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      year_published: DataTypes.INTEGER,
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Categories', // name of the table
          key: 'id',
        },},
    },
    {
      sequelize,
      modelName: 'Book',
    }
  );
  return Book;
};
