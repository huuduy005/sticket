/**
 * Created by huudu on 18/10/2016.
 */
var express = require('express');
var router = express.Router();
var Users = require('../models/users');

/* GET List movies. */
router.post('/', function (req, res, next) {
    // create a sample user
    var acc = new Users({
        id: req.body.id,
        name: req.body.name,
        password: req.body.password,
        admin: false
    });
    acc.save(function(err) {
        if (err) throw err;
        console.log('User saved successfully');
        res.json({ success: true });
    });
});

module.exports = router;