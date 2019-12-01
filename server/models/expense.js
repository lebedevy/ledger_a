'use strict';
module.exports = (sequelize, DataTypes) => {
  const expense = sequelize.define('expense', {
    user_id: DataTypes.INTEGER,
    expense_category: DataTypes.INTEGER,
    date: DataTypes.DATE,
    amount: DataTypes.DOUBLE,
    store_id: DataTypes.INTEGER
  }, {});
  expense.associate = function(models) {
    // associations can be defined here
  };
  return expense;
};