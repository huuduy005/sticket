var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');

var User = require('../models/users');
/*Controller*/
var UsersController = require('../controllers/users');
var EventsController = require('../controllers/events');
var DevicesController = require('../controllers/devices');
var TicketsController = require('../controllers/tickets');

var secret = config.secret;

var booking = require('./api/booking');
var logout = require('./api/logout');

router.get('/events', EventsController.getAll);
router.get('/devices', DevicesController.getAll);
router.get('/tickets', TicketsController.getAll);
router.get('/tickets/:id', TicketsController.get);
router.post('/tickets', TicketsController.create);
router.get('/users', UsersController.getAll);
router.post('/sign-up', UsersController.signup);
router.post('/sign-in', UsersController.signin);

router.post('/authenticate', function (req, res) {
    User.findOne({
        name: req.body.name
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                console.log(user.password);
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {
                // if user is found and password is right, create a token
                var token = jwt.sign(user, secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});

// route middleware to authenticate and check token
router.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                console.log(decoded);
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

module.exports = router;
