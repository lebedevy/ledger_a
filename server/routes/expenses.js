const express = require('express');
const router = express.Router();
const db = require('../models');
const checkAuth = require('../middleware/auth');
const validateExpense = require('../middleware/validateExpense');
const getSortAggregate = require('../middleware/getSortAggregate');
const getSortSummary = require('../middleware/getSortSummary');

// Add Expense
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
        category_id,
        date,
        amount,
        store_id,
    });

    console.log(record.dataValues);

    res.status(200).send({ message: 'Expense added ok.' });
});

// Method for uploading csv expenses
// This + insertForeignAndGetIds needs to be converted into a bulk insert
router.post('/upload', checkAuth, async (req, res, next) => {
    const { expenses } = req.body;
    if (!expenses || expenses.length === 0)
        return res.status(200).send({ message: 'No expenses were sent for upload' });
    const transaction = await db.sequelize.transaction();

    let query = `INSERT INTO expenses (user_id, amount, date, store_id, category_id, "createdAt", "updatedAt")
        VALUES `;

    try {
        console.info('Adding expense...');

        const expensesData = await insertForeignAndGetIds(expenses, transaction);
        expensesData.forEach((exp, ind) => {
            console.log(exp);
            query += `${ind > 0 ? ',' : ''} (${req.user.id}, ${db.sequelize.escape(
                exp.amount
            )}, ${db.sequelize.escape(exp.date)}, ${exp.store_id}, ${
                exp.category_id
            }, now(), now())`;
        });
        query += ';';
        console.log(query);

        await db.sequelize.query(query, { transaction });

        await transaction.commit();
        return res.status(200).send({ message: 'Upload complete' });
    } catch (e) {
        console.log('Error inserting csv expenses: ', e);
        await transaction.rollback();
        return res.status(500).send({ message: 'Upload Error' });
    }
});

// Insert stores and categories and get their ids
function insertForeignAndGetIds(expenses, transaction) {
    return Promise.all(
        expenses.map(async (expense) => {
            const { amount, date, store, category } = expense;

            const store_id = store ? await insertStore(store, transaction) : null;
            const category_id = category ? await insertCategory(category, transaction) : null;

            return { amount, date, store_id, category_id };
        })
    );
}

async function insertStore(store_name, transaction) {
    const [storeObj, storeCreated] = await db.stores.findOrCreate({
        where: { store_name },
        transaction,
    });
    return storeObj.id;
}

async function insertCategory(category_name, transaction) {
    const [categoryObj, catCreated] = await db.categories.findOrCreate({
        where: { category_name },
        transaction,
    });
    return categoryObj.id;
}

// Edit Expense: GET
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

// Edit Expense: POST
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

// List of all expenses for a period
router.get('/summary', checkAuth, getSortSummary, async (req, res, next) => {
    console.info('Serving expense summary');
    console.log(req.sortOption);
    const where = { user_id: req.user.id };
    if (req.query.start && req.query.end) {
        where.date = { [db.Sequelize.Op.between]: [req.query.start, req.query.end] };
    }
    const expenses = await db.expenses.findAll({
        where,
        order: db.sequelize.literal(req.sortOption),
        include: [db.categories, db.stores],
    });
    res.status(200).send({ expenses: expenses });
});

// Summary for all expenses for a period
router.get('/overview', checkAuth, async (req, res, next) => {
    console.log('Serving daily summary');
    const where = { user_id: req.user.id };
    if (req.query.start && req.query.end) {
        where.date = { [db.Sequelize.Op.between]: [req.query.start, req.query.end] };
    }
    const expenses = await db.expenses.findAll({
        where,
        attributes: ['date', [db.sequelize.fn('sum', db.sequelize.col('amount')), 'amount']],
        group: 'date',
        order: ['date'],
    });
    return res.status(200).send({ expenses });
});

// 12 month overview of expenses by category/store
router.get('/overview/:type/trends', checkAuth, async (req, res, next) => {
    const { type } = req.params;
    console.info('Serving trends for ' + type);
    const include = [];
    include.push(type === 'category' ? db.categories : db.stores);
    const where = { user_id: req.user.id };
    // const group = ['date'];
    // group.push(type === 'category' ? 'category.id' : 'store.id');

    if (req.query.id == null)
        return res
            .status(400)
            .send({ message: 'Please ensure the request specifies the source for details' });
    where[type === 'category' ? 'category_id' : 'store_id'] = req.query.id;
    if (req.query.start && req.query.end) {
        where.date = { [db.Sequelize.Op.between]: [req.query.start, req.query.end] };
    }

    const expenses = await db.expenses.findAll({
        where,
        attributes: [
            [db.sequelize.fn('date_trunc', 'month', db.sequelize.col('date')), 'txn_date'],
            [db.sequelize.fn('sum', db.sequelize.col('amount')), 'amount'],
        ],
        group: [db.sequelize.col('txn_date')],
        order: [db.sequelize.col('txn_date')],
        // include,
    });
    // .catch(err => {
    //     console.log(err);
    //     return res.status(500).send({ message: 'Server error processing your request' });
    // });

    return res.status(200).send({ expenses: expenses });
});

router.get('/overview/:type/details', checkAuth, async (req, res, next) => {
    const { type } = req.params;
    console.info('Serving details for ' + type);
    const include = [];
    include.push(type === 'category' ? db.stores : db.categories);
    const where = { user_id: req.user.id };

    if (req.query.id == null)
        return res
            .status(400)
            .send({ message: 'Please ensure the request specifies the source for details' });
    where[type === 'category' ? 'category_id' : 'store_id'] = req.query.id;
    if (req.query.start && req.query.end) {
        where.date = { [db.Sequelize.Op.between]: [req.query.start, req.query.end] };
    }

    const expenses = await db.expenses.findAll({
        where,
        order: ['date'],
        include,
    });
    return res.status(200).send({ expenses: expenses });
});

router.get('/summary/:type', checkAuth, getSortAggregate, async (req, res, next) => {
    const { type } = req.params;
    console.info('Serving aggregated summary type: ', type);
    const where = { user_id: req.user.id };
    if (req.query.start && req.query.end) {
        where.date = { [db.Sequelize.Op.between]: [req.query.start, req.query.end] };
    }

    const resources =
        type === 'category'
            ? { table: 'categories', column: 'category_name', group: 'categories.id' }
            : { table: 'stores', column: 'store_name', group: 'stores.id' };

    const expenses = await db[resources.table]
        .findAll({
            attributes: [
                'id',
                resources.column,
                [db.sequelize.fn('sum', db.sequelize.col('amount')), 'amount'],
            ],
            include: [
                {
                    model: db.expenses,
                    attributes: [],
                    where,
                },
            ],
            group: resources.group,
            order: db.sequelize.literal(req.sortOption),
        })
        .catch((e) => {
            console.log(e);
            return res
                .status(500)
                .send({ message: 'There was a server error processing your request' });
        });
    res.status(200).send(expenses);
});

router.get('/manage/merge/:type', checkAuth, async (req, res, next) => {
    const { type } = req.params;
    const expenses =
        type === 'category'
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
    const result = await db.categories.findAll({
        attributes: ['category_name'],
        order: ['category_name'],
        include: {
            model: db.expenses,
            attributes: [],
            where,
        },
    });

    const categories = result.map((item) => item.category_name);

    res.status(200).send({ categories });
});

router.get('/stores', checkAuth, async (req, res, next) => {
    console.info('Getting user stores');
    console.log(req.query);
    const where = { user_id: req.user.id };
    const result = await db.stores.findAll({
        attributes: ['store_name'],
        order: ['store_name'],
        include: {
            model: db.expenses,
            attributes: [],
            where,
        },
    });

    const stores = result.map((item) => item.store_name);

    res.status(200).send({ stores });
});

module.exports = router;
