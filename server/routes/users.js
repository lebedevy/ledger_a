const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');
const secret = require(__dirname + '/../config/config.json')['jwt']['secret'];

/* GET users listing. */
// router.get('/', async (req, res, next) => {
//     // console.log('here');
//     // const user = await db.user.findOne({ where: { firstName: 'Yury' } });
//     // console.log(user.dataValues);
//     // res.status(200).send({ message: 'ok' });
// });

// Register new user
router.post('/register', async (req, res, next) => {
    const { firstName, lastName, email, password: pass } = req.body;
    const password = await bcrypt.hash(pass, 10);
    const ensureUnique = await db.user.findOne({
        where: { email },
    });
    if (ensureUnique)
        return res.status(400).send({
            message: 'User already registered',
        });
    const user = await db.user.create({
        firstName,
        lastName,
        email,
        password,
    });

    if (user) return res.status(200).send({ message: 'ok' });
    else
        return res.status(500).send({
            message: 'There was an error registering user',
        });
});

// Login existing user
router.post('/login', async (req, res, next) => {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await db.user.findOne({
        where: { email },
    });
    // Verify user exists && provided correct password
    if (user && (await bcrypt.compare(password, user.dataValues.password))) {
        // create JWT
        const token = jwt.sign({ email: user.dataValues.email }, secret);
        // Set cookie
        res.cookie('jwt', token);
        return res.status(200).send({ message: 'ok' });
    } else
        return res.status(400).send({
            message: 'Please ensure email and password are correct',
        });
});

router.post('/logout', async (req, res, next) => {
    res.clearCookie('jwt');
    res.send({ message: 'User logged out.' });
});
module.exports = router;
