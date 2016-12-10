var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/users');
var Events = require('../models/events');

var secret = config.secret;

var TokensUtil = {};

TokensUtil.authenticate = function (req, res) {
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
};

// route middleware to authenticate and check token
TokensUtil.middleware = function (req, res, next) {
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
                //console.log(decoded);
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token return an error
        // return res.status(403).send({
        //     success: false,
        //     message: 'No token provided.'
        // });
        return res.redirect('/');
    }
};


TokensUtil.checkAuthorizationEvent = function (req, res, next) {
    // check
    var idEvent = req.body.event.idEvent;
    Events.findOne({
        idEvent: idEvent
    }, function (err, event) {
        if (err) {
            next(new Error(err));
        } else {
            if (event) {
                // Trường hợp này không xảy ra do idEvent gửi từ client lên chắn chắn sẽ có
            } else {
                // Kiểm tra phải là admin hay không
                if(parseInt(event.idAdmin) === parseInt(req.body.decoded._doc.idUser)) {
                  next();
                } else {
                  res.json({
                      success: true,
                      message: 'Bạn không phải là admin của event',
                  });
                }
            }
        }
    });
};



module.exports = TokensUtil;
