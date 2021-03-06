'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('expenses', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: { model: 'users', key: 'id', underscored: true },
            },
            category_id: {
                type: Sequelize.INTEGER,
                references: { model: 'categories', key: 'id', underscored: true },
            },
            store_id: {
                type: Sequelize.INTEGER,
                references: { model: 'stores', key: 'id', underscored: true },
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
