const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models');

/* GET users listing. */
router.get('/', async (req, res, next) => {
    console.log('here');
    const user = await db.user.findOne({ where: { firstName: 'Yury' } });
    console.log(user.dataValues);
    res.status(200).send({ message: 'ok' });
});

router.post('/expenses/add', async (req, res, next) => {
    const { expenses } = req.body;
    console.log(expenses);
    const { amount, store, category, date } = expenses;

    // await db.user.create({
    //     firstName: 'Yury',
    //     lastName: 'Lebedev',
    //     email: 'y.d.lebedev@gmail.com',
    //     password: await bcrypt.hash('test', 10),
    // });

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

router.get('/expenses/summary', async (req, res, next) => {
    const expenses = await db.expenses.findAll({
        where: { user_id: 1 },
        include: [db.categories, db.stores],
    });
    console.log(expenses);
    res.status(200).send({ expenses: expenses });
});

router.post('/register', async (req, res, next) => {
    const { first: firstName, last: lastName, email, password: pass } = req.params;
    const password = await bcrypt.hash(pass, 10);
    console.log(firstName, lastName, email, password);
    await db.user.create({
        firstName,
        lastName,
        email,
        password,
    });
});

module.exports = router;
