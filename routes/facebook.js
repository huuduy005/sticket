var express = require('express');
var router = express.Router();

var maxacminh = 'hulo005';
/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.query['hub.verify_token'] === maxacminh) {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

module.exports = router;
