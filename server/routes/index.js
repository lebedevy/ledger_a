var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('here');
    res.status(200).send({});
});

module.exports = router;
