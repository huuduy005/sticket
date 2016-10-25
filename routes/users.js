var express = require('express');
var router = express.Router();
var User = require('../models/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
    User.find(function(err, students) {
        if (err) return next(err);
        res.send(students);
    });
});

module.exports = router;
