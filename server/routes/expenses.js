const { spawn } = require('child_process');
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

    const transaction = await db.sequelize.transaction();

    try {
        const store_id = store ? await insertStore(store, transaction) : null;
        const category_id = category ? await insertCategory(category, transaction) : null;
        // Create expense record
        const record = await db.expenses.create(
            {
                user_id: req.user.id,
                category_id,
                date,
                amount,
                store_id,
            },
            { transaction }
        );

        console.log(record.dataValues);

        await transaction.commit();
        res.status(200).send({ message: 'Expense added ok.' });
    } catch (e) {
        console.log('Error adding single expense: ', e);
        await transaction.rollback();
        return res.status(500).send({ message: 'Error while adding expense' });
    }
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
router.put('/edit/:id', checkAuth, async (req, res, next) => {
    console.info('Updating expense...');
    let { amount, date, store, category } = req.body.expense;
    const { id } = req.params;

    // Do some basic data cleaning
    [store, category] = [store, category].map((el) => (el ? el.trim() : ''));
    store = store === '' ? null : store;
    category = category === '' ? null : category;

    const transaction = await db.sequelize.transaction();

    // Get expense
    const expense = await db.expenses.findOne({
        where: { id, user_id: req.user.id },
        include: [{ model: db.categories }, { model: db.stores }],
        transaction,
    });

    if (expense) {
        if (expense.user_id === req.user.id) {
            const updatedExpense = {};

            try {
                if (store) {
                    updatedExpense.store_id = await insertStore(store, transaction);
                }

                if (category) {
                    updatedExpense.category_id = await insertCategory(category, transaction);
                }

                if (date) {
                    updatedExpense.date = date;
                }

                if (amount != null && !isNaN(amount)) {
                    updatedExpense.amount = amount;
                }

                console.log(req.body.expense);
                console.log(updatedExpense);
                // Update fields
                await expense.update(updatedExpense, { transaction });
                transaction.commit();
                return res.status(200).send({ message: 'Expense updated ok' });
            } catch (e) {
                transaction.rollback();
                return res.status(500).send({ message: 'There was an error updating the expense' });
            }
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
        attributes: [
            'id',
            'amount',
            'date',
            [db.Sequelize.col('category.category_name'), 'category'],
            [db.Sequelize.col('store.store_name'), 'store'],
        ],
        order: db.sequelize.literal(req.sortOption),
        include: [
            { model: db.categories, attributes: [] },
            { model: db.stores, attributes: [] },
        ],
        raw: true,
    });
    res.status(200).send({ expenses });
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

class Resources {
    constructor(type) {
        const cat = this.createObject(
            ...['categories', 'category_name', 'categories.id', 'category']
        );
        const store = this.createObject(...['stores', 'store_name', 'stores.id', 'store']);
        const main = type === 'category' ? cat : store;
        const secondary = type === 'category' ? store : cat;
        return { main, secondary };
    }

    createObject(table, column, group, alais) {
        return { table, column, group, alais };
    }
}

router.get('/overview/:type/details', checkAuth, async (req, res, next) => {
    if (req.user.id == null) throw Error('No user id provided');
    const { type } = req.params;
    console.info('Serving details for ' + type);
    const where = { user_id: req.user.id };

    if (req.query.id == null)
        return res
            .status(400)
            .send({ message: 'Please ensure the request specifies the source for details' });
    where[type === 'category' ? 'category_id' : 'store_id'] = req.query.id;

    const resources = new Resources(type);

    let query = `SELECT expenses.id, amount, date, ${resources.secondary.table}.${
        resources.secondary.column
    } AS ${resources.secondary.alais}
     FROM expenses LEFT JOIN ${resources.secondary.table} ON ${
        resources.secondary.table
    }.id = expenses.${type === 'category' ? 'store_id' : 'category_id'}
     WHERE user_id = ${db.sequelize.escape(req.user.id)} AND 
     expenses.${type === 'category' ? 'category_id' : 'store_id'} = ${db.sequelize.escape(
        req.query.id
    )} `;

    if (req.query.start && req.query.end)
        query += `AND expenses.date BETWEEN ${db.sequelize.escape(
            req.query.start
        )} AND ${db.sequelize.escape(req.query.end)}`;

    query += ` ORDER BY amount DESC;`;

    console.log(query);

    const expenses = (await db.sequelize.query(query, { raw: true }))[0];

    // const expenses = await db.expenses.findAll({
    //     attributes: ['id', 'amount', 'date', [db.Sequelize.col(``), ,]],
    //     where,
    //     order: ['date'],
    //     include: [{ model: type === 'category' ? db.stores : db.categories, attributes: [] }],
    //     raw: true,
    // });

    console.log(expenses);
    return res.status(200).send({ expenses });
});

router.get('/summary/:type', checkAuth, getSortAggregate, async (req, res, next) => {
    const { type } = req.params;
    console.info('Serving aggregated summary type: ', type);
    const where = { user_id: req.user.id };
    if (req.query.start && req.query.end) {
        where.date = { [db.Sequelize.Op.between]: [req.query.start, req.query.end] };
    }

    const resources = new Resources(type);

    const expenses = await db[resources.main.table]
        .findAll({
            attributes: [
                'id',
                [db.sequelize.fn('sum', db.sequelize.col('amount')), 'amount'],
                [
                    db.Sequelize.col(`${resources.main.table}.${resources.main.column}`),
                    resources.main.alais,
                ],
            ],
            include: [
                {
                    model: db.expenses,
                    attributes: [],
                    where,
                },
            ],
            group: resources.main.group,
            order: db.sequelize.literal(req.sortOption),
            raw: true,
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
    const ids = req.body;
    const user_id = req.user.id;
    if (ids == null || user_id == null)
        return res.status(400).send({ message: 'Please verify request data.' });

    const transaction = await db.sequelize.transaction();

    try {
        // Ensure user owns resource by checking that their id matches
        await db.expenses.destroy({ where: { id: ids, user_id }, transaction });
        transaction.commit();
        return res.status(200).send({ message: 'ok' });
    } catch (e) {
        transaction.rollback();
        console.log(e);
        return res.status(500).send({ message: 'There was an error processing your request.' });
    }
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

router.get('/category_suggestions/:id', checkAuth, async (req, res, next) => {
    console.log('Getting category suggestions');

    const user_id = req.user.id;
    const { id } = req.params;
    let session_id;

    if (user_id == null) return res.status(400).send({ message: 'Bad request' });

    // Create a new model for a user
    // const python = spawn('python3', ['prediction/create_prediction_model.py', req.user.id]);

    const transaction = await db.sequelize.transaction();

    // Begin session and load in the required data
    try {
        // generate session id
        session_id = await startPredictionSession(user_id, transaction);
        // Get expense
        const exp = await db.expenses.findOne({ where: { id, user_id }, raw: true, transaction });
        // Load expenses to predict cat for
        await loadPredictionSessionData(exp, session_id, transaction);
        transaction.commit();
    } catch (e) {
        console.log('There was an error getting category suggestions', e);
        transaction.rollback();
        return res.status(500).send({ message: 'There was an error getting category suggestions' });
    }

    try {
        await spawnPredictor(session_id);
    } catch (e) {
        console.log('Python prediction failed', e);
        return res.status(500).send({ message: 'There was an error getting category suggestions' });
    }

    const classes = await db.sequelize.query(
        `SELECT classes FROM prediction_session WHERE id=${escape(session_id)};`,
        { raw: true }
    );
    const classList = await getClassList(classes[0][0].classes);
    console.log(classList);

    const predictions = await db.sequelize.query(
        `SELECT expense_id, predictions FROM cat_classifier_predictions WHERE session_id=${escape(
            session_id
        )};`,
        { raw: true }
    );
    // console.log(predictions[0]);

    // End session and clean up
    const transactionCleanup = await db.sequelize.transaction();
    try {
        await removeSessionExpenses(session_id, transactionCleanup);
        await removeSession(session_id, transactionCleanup);
        transactionCleanup.commit();
    } catch (e) {
        console.log('There was an error during category suggestions cleanup', e);
        transactionCleanup.rollback();
        return res.status(500).send({ message: 'There was an error getting category suggestions' });
    }

    return res.status(200).send({ predictions: predictions[0], classList });
});

async function getClassList(ids) {
    // Have to preserve the order of ids
    const list = await db.categories.findAll({
        attributes: ['id', 'category_name'],
        where: { id: ids },
        raw: true,
    });

    const classes = {};
    for (l in list) {
        const cl = list[l];
        classes[cl.id] = cl.category_name;
    }

    return ids.map((id) => classes[id]);
}

async function startPredictionSession(user_id, transaction) {
    const id = await db.sequelize.query(
        `INSERT INTO prediction_session (user_id, "createdAt", "updatedAt") VALUES (${db.sequelize.escape(
            user_id
        )}, now(), now()) RETURNING id;`,
        { transaction, raw: true }
    );

    if (id[0][0].id == null) throw new Error('No session id generated');

    return id[0][0].id;
}

function loadPredictionSessionData(exp, session_id, transaction) {
    return db.sequelize.query(
        `INSERT INTO cat_classifier_predictions (
        session_id,
        expense_id,
        amount,
        store_id,
        date,
        "createdAt",
        "updatedAt") VALUES (
        ${escape(session_id)},
        ${escape(exp.id)},
        ${escape(exp.amount != null ? exp.amount : 0)},
        ${escape(exp.store_id != null ? exp.store_id : -1)},
        ${escape(exp.date)},
        now(),
        now()
        );`,
        { transaction }
    );
}

function removeSession(session_id, transaction) {
    return db.sequelize.query(`DELETE FROM prediction_session WHERE id=${escape(session_id)};`, {
        transaction,
        raw: true,
    });
}

function removeSessionExpenses(session_id, transaction) {
    return db.sequelize.query(
        `DELETE FROM cat_classifier_predictions WHERE session_id=${escape(session_id)};`,
        { transaction, raw: true }
    );
}

function spawnPredictor(session_id) {
    // Get predictions using model
    const python = spawn('python3', ['prediction/get_predictions.py', session_id]);

    return new Promise((resolve, reject) => {
        python.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        python.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        python.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (code === 0) resolve();
            else reject();
        });
    });
}

function escape(val) {
    return db.sequelize.escape(val);
}

module.exports = router;
