const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = 'hj2bas2361d55hKJhd9AHd9a.asd0121';

async function checkAuth(req, res, next) {
    console.log('Checking Auth');
    console.log(req.cookies);
    const token = req.cookies.jwt;
    // const token =
    //     'egJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE1NzU2NTYwNjJ9.2xzHgv3iHamt058C2WwSmTdz2WjW9Vj8HQ2GCSc6GiQ';
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
