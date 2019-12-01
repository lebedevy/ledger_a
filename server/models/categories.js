'use strict';
module.exports = (sequelize, DataTypes) => {
    const categories = sequelize.define(
        'categories',
        {
            category_name: DataTypes.STRING,
        },
        {}
    );
    categories.associate = function(models) {
        // associations can be defined here
        categories.hasMany(models.expenses, { foreignKey: 'category_id', sourceKey: 'id' });
        // categories.hasOne(models.expenses);
        // categories.belongsTo(models.expenses);
    };
    return categories;
};
