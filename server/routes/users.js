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
