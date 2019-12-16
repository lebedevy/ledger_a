const express = require('express');
const router = express.Router();
const db = require('../models');
const checkAuth = require('../middleware/auth');
const validateExpense = require('../middleware/validateExpense');

router.post('/add', checkAuth, validateExpense, async (req, res, next) => {
    console.info('Adding expense...');
    const { expense } = req;
    const { amount, date, store, category } = expense;
    let store_id = null,
        category_id = null;

    // Create store
    if (store) {
        const [storeObj, storeCreated] = await db.stores.findOrCreate({
            where: { store_name: store },
        });
        store_id = storeObj.id;
    }

    if (category) {
        // Create category
        const [categoryObj, catCreated] = await db.categories.findOrCreate({
            where: { category_name: category },
        });
        category_id = categoryObj.id;
    }

    // Create expense record
    const record = await db.expenses.create({
        user_id: req.user.id,
        category_id: category_id,
        date,
        amount,
        store_id: store_id,
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
            const store = expense.store ? expense.store.store_name : '';
            const category = expense.category ? expense.category.category_name : '';
            // console.log(id, amount, store, category, date);
            return res.status(200).send({ expense: { id, amount, store, category, date } });
        }
        console.info('User attempted access to unathorized expense resource.');
    }
    return res.status(400).send({ message: 'Please ensure the correct expense is requested' });
});

router.post('/edit/:id', checkAuth, validateExpense, async (req, res, next) => {
    console.info('Updating expense...');
    const { amount, date, store, category } = req.expense;
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
            if (store) {
                const [storeObj, storeCreated] = await db.stores.findOrCreate({
                    where: { store_name: store },
                });
                console.info(`Store created?: ${storeCreated}`);
                store_id = storeObj.id;
            }

            // Create or get category
            if (category) {
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
        order: ['category_name'],
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
        order: ['store_name'],
        include: {
            model: db.expenses,
            attributes: [],
            where,
        },
    });
    res.status(200).send({ stores });
});

module.exports = router;
