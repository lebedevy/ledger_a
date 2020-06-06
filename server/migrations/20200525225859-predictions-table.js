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
                    `CREATE TABLE cat_classifier_predictions (
                      id bigserial PRIMARY KEY NOT NULL,
                      session_id INT NOT NULL,
                      expense_id INT NOT NULL,
                      amount int,
                      store VARCHAR(255),
                      date date,
                      predictions DOUBLE PRECISION[],
                      "createdAt" date NOT NULL,
                      "updatedAt" date NOT NULL  
                  );`,
                    {
                        transaction,
                        raw: true,
                    }
                );
                await queryInterface.sequelize.query(
                    `CREATE TABLE prediction_session (
                    id bigserial PRIMARY KEY NOT NULL,
                    user_id INT references users(id) NOT NULL,
                    classes INT[],
                    "createdAt" date NOT NULL,
                    "updatedAt" date NOT NULL  
                );`,
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
                await queryInterface.sequelize.query(`DROP TABLE cat_classifier_predictions;`, {
                    transaction,
                    raw: true,
                });
                await queryInterface.sequelize.query(`DROP TABLE prediction_session;`, {
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
