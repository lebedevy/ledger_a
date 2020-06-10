'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return new Promise(async (resolve, reject) => {
            const transaction = await queryInterface.sequelize.transaction();
            try {
                await queryInterface.sequelize.query(
                    `CREATE TABLE store_name_upload_map (
                      id bigserial PRIMARY KEY NOT NULL,
                      user_id INT REFERENCES users(id),
                      upload_store_name VARCHAR(255),
                      store_id INT REFERENCES stores(id),
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
        return new Promise(async (resolve, reject) => {
            const transaction = await queryInterface.sequelize.transaction();
            try {
                await queryInterface.sequelize.query(`DROP TABLE store_name_upload_map;`, {
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
