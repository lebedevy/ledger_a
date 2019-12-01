'use strict';
module.exports = (sequelize, DataTypes) => {
    const expense_category = sequelize.define(
        'categories',
        {
            category_name: DataTypes.STRING,
        },
        {}
    );
    expense_category.associate = function(models) {
        // associations can be defined here
    };
    return expense_category;
};
