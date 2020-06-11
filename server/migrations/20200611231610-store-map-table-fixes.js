'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return new Promise(async (resolve, reject) => {
            /*
            The goal is to clean the data to ensure that there is only one store mapping per name per user
            And to add constraints to ensure it stays like that in the future
            1. create temp table and select unique store names maps (per user) into it
            2. clear original table
            3. Insert unqiue expenses back in to original
            4. Add unique constraint on store name / user_id combination
            5. Add non null constraints
             */

            const transaction = await queryInterface.sequelize.transaction();

            try {
                await queryInterface.sequelize.query(
                    `CREATE TEMPORARY TABLE tmp_usn ON COMMIT DROP AS (
                        SELECT DISTINCT ON (upload_store_name, user_id) upload_store_name, store_id, id, user_id, 
                        "createdAt", "updatedAt"
                        FROM store_name_upload_map
                        WHERE store_id IS NOT NULL
                        ORDER BY upload_store_name, user_id, "updatedAt"
                    );`,
                    {
                        transaction,
                        raw: true,
                    }
                );

                await queryInterface.sequelize.query(`DELETE FROM store_name_upload_map;`, {
                    transaction,
                    raw: true,
                });

                await queryInterface.sequelize.query(
                    `INSERT INTO store_name_upload_map (
                        SELECT id, user_id, upload_store_name, store_id, 
                        "createdAt", "updatedAt" FROM tmp_usn);`,
                    {
                        transaction,
                        raw: true,
                    }
                );

                await queryInterface.sequelize.query(
                    `ALTER TABLE store_name_upload_map ADD CONSTRAINT unique_user_store UNIQUE (user_id, upload_store_name);`,
                    {
                        transaction,
                        raw: true,
                    }
                );

                await queryInterface.sequelize.query(
                    `ALTER TABLE store_name_upload_map 
                        ALTER COLUMN store_id SET NOT NULL,
                        ALTER COLUMN user_id SET NOT NULL,
                        ALTER COLUMN upload_store_name SET NOT NULL;`,
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
        // nothing needs to be done
        return;
    },
};
