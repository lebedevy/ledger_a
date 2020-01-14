const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require(__dirname + '/../config/config.json')['jwt']['secret'];

async function checkAuth(req, res, next) {
    console.log('Checking Auth');
    const token = req.cookies.jwt;
    let check;
    try {
        check = await jwt.verify(token, secret);
    } catch (e) {
        // Will catch both invalid token and malformed tokens
        // console.log(e);
        console.log('Error during jwt verify.');
        return res
            .status(400)
            .send({ message: 'Authentication error. Please logout and log back in.' });
    }

    req.user = (await db.user.findOne({ where: { email: check.email } })).dataValues;

    return next();
}

module.exports = checkAuth;
