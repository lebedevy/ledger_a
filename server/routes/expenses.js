const express = require('express');
const router = express.Router();
const db = require('../models');

router.post('/add', async (req, res, next) => {
    const { expenses } = req.body;
    console.log(expenses);
    const { amount, store, category, date } = expenses;

    const user = await db.user.findOne({ where: { firstName: 'Yury' } });
    if (user == null) return res.status(400).send({ message: 'User is null. Check seed' });
    console.log(user.dataValues);
    console.log(amount, store, category, date);

    // Create store
    const [storeObj, storeCreated] = await db.stores.findOrCreate({ where: { store_name: store } });

    // Create category
    const [categoryObj, catCreated] = await db.categories.findOrCreate({
        where: { category_name: category },
    });

    console.log('\n\n', storeObj.dataValues, storeCreated, categoryObj.dataValues, catCreated);
    // Create expense record
    const record = await db.expenses.create({
        user_id: user.id,
        category_id: categoryObj.id,
        date,
        amount,
        store_id: storeObj.id,
    });

    console.log(record.dataValues);

    res.status(200).send({ message: 'Expense added ok.' });
});

router.get('/summary', async (req, res, next) => {
    const expenses = await db.expenses.findAll({
        where: { user_id: 1 },
        order: ['date'],
        include: [db.categories, db.stores],
    });
    console.log(expenses);
    res.status(200).send({ expenses: expenses });
});

router.get('/summary/:type', async (req, res, next) => {
    const { type } = req.params;
    console.log(type);
    // const expenses = await db.expenses.findAll({
    //     where: { user_id: 1 },
    //     include: [{ model: db.stores, attributes: [] }],
    //     group: 'store_id',
    //     attributes: ['store_id', [db.sequelize.fn('sum', db.sequelize.col('amount')), 'amount']],
    // });
    const expenses =
        type === 'cat'
            ? await db.categories.findAll({
                  attributes: [
                      'id',
                      'category_name',
                      [db.sequelize.fn('sum', db.sequelize.col('amount')), 'amount'],
                  ],
                  include: [
                      {
                          model: db.expenses,
                          attributes: [],
                          where: { user_id: 1 },
                      },
                  ],
                  group: 'categories.id',
              })
            : await db.stores.findAll({
                  attributes: [
                      'id',
                      'store_name',
                      [db.sequelize.fn('sum', db.sequelize.col('amount')), 'amount'],
                  ],
                  include: [
                      {
                          model: db.expenses,
                          attributes: [],
                          where: { user_id: 1 },
                      },
                  ],
                  group: 'stores.id',
              });
    console.log(expenses);
    res.status(200).send(expenses);
});

router.get('/manage/merge/:type', async (req, res, next) => {
    const { type } = req.params;
    const expenses =
        type === 'cat'
            ? await db.categories.findAll({
                  attributes: ['id', 'category_name'],
                  include: [
                      {
                          model: db.expenses,
                          attributes: [],
                          where: { user_id: 1 },
                      },
                  ],
                  group: 'categories.id',
                  sort: ['category_name'],
              })
            : await db.stores.findAll({
                  attributes: ['id', 'store_name'],
                  include: [
                      {
                          model: db.expenses,
                          attributes: [],
                          where: { user_id: 1 },
                      },
                  ],
                  group: 'stores.id',
                  sort: ['store_name'],
              });

    res.status(200).send(expenses);
});

module.exports = router;
