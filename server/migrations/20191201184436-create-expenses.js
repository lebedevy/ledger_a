'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('expenses', {
            expense_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id' },
            },
            expense_category: {
                type: Sequelize.INTEGER,
                references: { model: 'expense_categories', key: 'category_id' },
            },
            store_id: {
                type: Sequelize.INTEGER,
                references: { model: 'stores', key: 'store_id' },
            },
            date: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            amount: {
                allowNull: false,
                type: Sequelize.DOUBLE,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('expenses');
    },
};
