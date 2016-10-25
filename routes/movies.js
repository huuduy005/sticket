/**
 * Created by huudu on 18/10/2016.
 */
var express = require('express');
var router = express.Router();
var Movies = require('../models/movies');

/* GET List movies. */
router.get('/', function (req, res, next) {
    Movies.find(function (err, movies) {
        if (err) return console.error(err);
        res.send(movies);
    });
});

router.get('/web', function (req, res, next) {
    res.send();
});

module.exports = router;
