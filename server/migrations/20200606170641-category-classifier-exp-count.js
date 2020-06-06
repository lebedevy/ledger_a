'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        // Add new table for classifiers
        // add unique constraints: user_id
        // add foreign keys: user_id
        return new Promise(async (resolve, reject) => {
            const transaction = await queryInterface.sequelize.transaction();
            try {
                await queryInterface.sequelize.query(
                    `ALTER TABLE category_classifier ADD COLUMN expense_count INT DEFAULT 0;`,
                    {
                        transaction,
                        raw: true,
                    }
                );
                transaction.commit();
                resolve();
            } catch (e) {
                transaction.rollback();
                reject();
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return new Promise(async (resolve, reject) => {
            const transaction = await queryInterface.sequelize.transaction();
            try {
                await queryInterface.sequelize.query(
                    `ALTER TABLE category_classifier DROP COLUMN IF EXISTS expense_count;`,
                    {
                        transaction,
                        raw: true,
                    }
                );
                transaction.commit();
                resolve();
            } catch (e) {
                transaction.rollback();
                reject();
            }
        });
    },
};
