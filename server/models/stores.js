'use strict';
module.exports = (sequelize, DataTypes) => {
    const store = sequelize.define(
        'stores',
        {
            store_name: DataTypes.STRING,
        },
        {}
    );
    store.associate = function(models) {
        // associations can be defined here
        store.hasMany(models.expenses, { foreignKey: 'store_id', targetKey: 'id' });
    };
    return store;
};
