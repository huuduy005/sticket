var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/users');
var Events = require('../models/events');

var secret = config.secret;

var TokensUtil = {};

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
                    status: 'FAIL',
                    message: 'Mã xác thực truy cập sai.'
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
        return res.status(403).send({
            status: 'FAIL',
            message: 'Không có quyền truy cập.'
        });
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
                      status: 'FAIL',
                      message: 'Bạn không phải là người tổ chức event.'
                  });
                }
            }
        }
    });
};



module.exports = TokensUtil;
