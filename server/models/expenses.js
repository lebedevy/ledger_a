'use strict';
module.exports = (sequelize, DataTypes) => {
    const expense = sequelize.define(
        'expenses',
        {
            user_id: DataTypes.INTEGER,
            category_id: DataTypes.INTEGER,
            date: DataTypes.DATE,
            amount: DataTypes.DOUBLE,
            store_id: DataTypes.INTEGER,
        },
        {}
    );
    expense.associate = function(models) {
        // associations can be defined here
        // expense.hasOne(models.categories);
        // expense.hasMany(models.categories, {});
        // expense.hasOne(models.categories);
        expense.belongsTo(models.categories, { foreignKey: 'category_id', targetKey: 'id' });
        expense.belongsTo(models.stores, { foreignKey: 'store_id', targetKey: 'id' });
    };
    return expense;
};
