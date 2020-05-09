'use strict';

const STORE_TABLE_NAME = 'stores';
const STORE_ID_FIELD = 'store_id';
const STORE_NAME_FIELD = 'store_name';
const CAT_TABLE_NAME = 'categories';
const CAT_ID_FIELD = 'category_id';
const CAT_NAME_FIELD = 'category_name';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return new Promise(async (resolve, reject) => {
            const t = await queryInterface.sequelize.transaction();
            try {
                await addUniqueConstraint(STORE_NAME_FIELD, STORE_ID_FIELD, STORE_TABLE_NAME);
                await addUniqueConstraint(CAT_NAME_FIELD, CAT_ID_FIELD, CAT_TABLE_NAME);

                async function addUniqueConstraint(name, id, table) {
                    // Get non unique stores
                    const dupS = await queryInterface.sequelize.query(
                        `SELECT ${name} FROM (SELECT ${name}, COUNT(*) as count 
                    FROM ${table} GROUP BY ${name}) as t WHERE count > 1;`,
                        {
                            transaction: t,
                            raw: true,
                            type: Sequelize.QueryTypes.SELECT,
                        }
                    );

                    console.log(dupS);

                    // update references in expenses table
                    await Promise.all(
                        dupS.map((field) =>
                            queryInterface.sequelize.query(
                                `UPDATE expenses SET ${id} = (SELECT id FROM ${table} WHERE ${name} = 
                                ${queryInterface.sequelize.escape(
                                    field[name]
                                )} ORDER BY id LIMIT 1) 
                                WHERE ${id} IN (SELECT id FROM ${table} WHERE 
                                ${name} = ${queryInterface.sequelize.escape(field[name])});`,
                                {
                                    transaction: t,
                                    raw: true,
                                }
                            )
                        )
                    );

                    // Remove Duplicates
                    await Promise.all(
                        dupS.map((field) =>
                            queryInterface.sequelize.query(
                                `DELETE FROM ${table} WHERE id IN (
                                SELECT id FROM ${table} WHERE ${name} = ${queryInterface.sequelize.escape(
                                    field[name]
                                )} AND id NOT IN (SELECT id FROM ${table} WHERE
                                ${name} = ${queryInterface.sequelize.escape(
                                    field[name]
                                )} ORDER BY id LIMIT 1));`,
                                {
                                    transaction: t,
                                    raw: true,
                                    type: Sequelize.QueryTypes.SELECT,
                                }
                            )
                        )
                    );

                    await queryInterface.sequelize.query(
                        `ALTER TABLE ${table} ADD CONSTRAINT unique_${name} UNIQUE (${name});`,
                        {
                            transaction: t,
                            raw: true,
                        }
                    );
                }
                t.commit();
                resolve();
            } catch (e) {
                t.rollback();
                console.log('Error migrating store-category-unique-names contraint', e);
                reject();
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return new Promise(async (resolve, reject) => {
            const t = await queryInterface.sequelize.transaction();

            try {
                await queryInterface.sequelize.query(
                    `ALTER TABLE ${STORE_TABLE_NAME} DROP CONSTRAINT unique_${STORE_NAME_FIELD};`,
                    {
                        transaction: t,
                        raw: true,
                    }
                );

                await queryInterface.sequelize.query(
                    `ALTER TABLE ${CAT_TABLE_NAME} DROP CONSTRAINT unique_${CAT_NAME_FIELD};`,
                    {
                        transaction: t,
                        raw: true,
                    }
                );
                t.commit();
                resolve();
            } catch (e) {
                t.rollback();
                console.log('Error undoing migration store-category-unique-names contraint', e);
                reject();
            }
        });
    },
};
