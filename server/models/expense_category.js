'use strict';
module.exports = (sequelize, DataTypes) => {
  const expense_category = sequelize.define('expense_category', {
    category_id: DataTypes.INTEGER,
    category_name: DataTypes.STRING
  }, {});
  expense_category.associate = function(models) {
    // associations can be defined here
  };
  return expense_category;
};