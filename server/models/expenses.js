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
    };
    return expense;
};
