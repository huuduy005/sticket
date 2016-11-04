var express = require('express');
var router = express.Router();

var facebook = require('./myservices/facebook');
var portal = require('./myservices/portal');
var crawler = require('./myservices/crawler');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Services' });
});

router.use('/webhook', facebook);
router.use('/portal', portal);
// router.use('/crawler', crawler);

module.exports = router;
