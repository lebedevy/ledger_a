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
                    `CREATE TABLE category_classifier(
                        id bigserial PRIMARY KEY NOT NULL,
                        user_id INT references users(id) NOT NULL,
                        model bytea NOT NULL,
                        "createdAt" date NOT NULL,
                        "updatedAt" date NOT NULL
                     );`,
                    {
                        transaction,
                        raw: true,
                    }
                );
                await queryInterface.sequelize.query(
                    `ALTER TABLE category_classifier ADD CONSTRAINT unique_user_id UNIQUE (user_id);`,
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
        // All we need to do is to drop the new table
        return new Promise(async (resolve, reject) => {
            const transaction = await queryInterface.sequelize.transaction();
            try {
                await queryInterface.sequelize.query(`DROP TABLE category_classifier;`, {
                    transaction,
                    raw: true,
                });
                transaction.commit();
                resolve();
            } catch (e) {
                transaction.rollback();
                reject();
            }
        });
    },
};
