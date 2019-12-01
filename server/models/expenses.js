'use strict';
module.exports = (sequelize, DataTypes) => {
  const expenses = sequelize.define('expenses', {
    test: DataTypes.STRING
  }, {});
  expenses.associate = function(models) {
    // associations can be defined here
  };
  return expenses;
};