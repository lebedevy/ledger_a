const express = require('express');
const router = express.Router();
const db = require('../models');
const checkAuth = require('../middleware/auth');

router.post('/add', checkAuth, async (req, res, next) => {
    const { expenses } = req.body;
    console.log(expenses);
    const { amount, store, category, date } = expenses;
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
        user_id: req.user.id,
        category_id: categoryObj.id,
        date,
        amount,
        store_id: storeObj.id,
    });

    console.log(record.dataValues);

    res.status(200).send({ message: 'Expense added ok.' });
});

router.get('/edit/:id', checkAuth, async (req, res, next) => {
    console.log('Getting expense');
    const { id } = req.params;
    const expense = await db.expenses.findOne({
        where: { id, user_id: req.user.id },
        include: [{ model: db.categories }, { model: db.stores }],
    });
    if (expense) {
        if (expense.user_id === req.user.id) {
            console.log(expense);
            const { id, amount, date } = expense;
            const store = expense.store.store_name;
            const category = expense.category.category_name;
            // console.log(id, amount, store, category, date);
            return res.status(200).send({ expense: { id, amount, store, category, date } });
        }
        console.info('User attempted access to unathorized expense resource.');
    }
    return res.status(400).send({ message: 'Please ensure the correct expense is requested' });
});

router.post('/edit/:id', checkAuth, async (req, res, next) => {
    console.info('Updating expense...');
    const { amount, store, category, date } = req.body;
    const { id } = req.params;
    const expense = await db.expenses.findOne({
        where: { id, user_id: req.user.id },
        include: [{ model: db.categories }, { model: db.stores }],
    });
    if (expense) {
        if (expense.user_id === req.user.id) {
            let category_id = null,
                store_id = null;

            // Create or get store
            if (store != null || store != '') {
                const [storeObj, storeCreated] = await db.stores.findOrCreate({
                    where: { store_name: store },
                });
                console.info(`Store created?: ${storeCreated}`);
                store_id = storeObj.id;
            }

            // Create or get category
            if (category != null || category != '') {
                const [categoryObj, catCreated] = await db.categories.findOrCreate({
                    where: {
                        category_name: category,
                    },
                });
                console.info(`Category created?: ${catCreated}`);
                category_id = categoryObj.id;
            }

            // Update fields
            const update = await expense.update({ category_id, store_id, amount, date });
            // console.log(update);
            return res.status(200).send({ message: 'Update ok' });
        }
        console.info('User attempted update unathorized expense resource.');
    }
    return res.status(400).send({
        message: 'Please ensure all the parameters are correct',
    });
});

router.get('/summary', checkAuth, async (req, res, next) => {
    console.info('Serving expense summary');
    console.log(req.query);
    const where = { user_id: req.user.id };
    if (req.query.start && req.query.end) {
        where.date = { [db.Sequelize.Op.between]: [req.query.start, req.query.end] };
    }
    const expenses = await db.expenses.findAll({
        where,
        order: ['date'],
        include: [db.categories, db.stores],
    });
    // console.log(req.user);
    // console.log(expenses);
    res.status(200).send({ expenses: expenses });
});

router.get('/summary/:type', checkAuth, async (req, res, next) => {
    const { type } = req.params;
    console.info('Serving aggregated summary ', type);
    const where = { user_id: req.user.id };
    if (req.query.start && req.query.end) {
        where.date = { [db.Sequelize.Op.between]: [req.query.start, req.query.end] };
    }
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
                          where,
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
                          where,
                      },
                  ],
                  group: 'stores.id',
              });
    // console.log(expenses);
    res.status(200).send(expenses);
});

router.get('/manage/merge/:type', checkAuth, async (req, res, next) => {
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

router.post('/delete', checkAuth, async (req, res, next) => {
    console.log(req.body);
    const { id } = req.body;
    if (id == null) return res.status(400).send({ message: 'Please verify request data.' });
    // Ensure user owns resource, and delete if so
    const expense = await db.expenses.findOne({ where: { id, user_id: req.user.id } });
    console.log(expense);
    if (expense) {
        const result = await expense.destroy();
        console.log(result);
    } else return res.status(400).send({ message: 'Please verify request data.' });
    return res.status(200).send({ message: 'ok' });
});

router.get('/categories', checkAuth, async (req, res, next) => {
    console.info('Getting user categories');
    console.log(req.query);
    const where = { user_id: req.user.id };
    const categories = await db.categories.findAll({
        attributes: ['category_name'],
        include: {
            model: db.expenses,
            attributes: [],
            where,
        },
    });
    res.status(200).send({ categories });
});

router.get('/stores', checkAuth, async (req, res, next) => {
    console.info('Getting user stores');
    console.log(req.query);
    const where = { user_id: req.user.id };
    const stores = await db.stores.findAll({
        attributes: ['store_name'],
        include: {
            model: db.expenses,
            attributes: [],
            where,
        },
    });
    res.status(200).send({ stores });
});

module.exports = router;
