'use strict';
module.exports = (sequelize, DataTypes) => {
  const store = sequelize.define('store', {
    store_id: DataTypes.INTEGER,
    store_name: DataTypes.STRING
  }, {});
  store.associate = function(models) {
    // associations can be defined here
  };
  return store;
};