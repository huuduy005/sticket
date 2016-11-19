var Devices = require('../models/devices');
var User = require('../models/users');
var Ticket = require('../models/tickets');
var jwt = require('jsonwebtoken');
var config = require('../config');
var secret = config.secret;

var CheckController = {};



CheckController.checkQR = function (req, res) {
    console.log(req.body);
    console.log(req.body.MAC);
    // Find Mac
    var d = Devices.findOne({
        MAC: req.body.MAC
    }, function (err, devices) {
        if (err) throw err;
        if (!devices) {
            res.json({
                status: 'Fail',
                message: 'Không tồn tại trường hợp này, sai rồi'
            });
        } else if (devices) {
            // Find User
            User.findOne({
                id: devices.user
            }, function (err, us) {
                if (err) throw err;
                if(!us) {
                    res.json({
                    status: 'Fail',
                    message: 'Không tồn tại trường hợp này, sai rồi'
                    });
                } else if(us) {
                    // Find List ticket
                    Ticket.find({user: us.id}, function(err, list) {
                        if(err) 
                            res.json(err);
                        else {
                                // Check OTP of each element ticket.
                                var flag = false;
                                for (var i = 0; i < list.length; i++) {
                                    var OTPEachTicket = list[i];
                                    console.log('OTP -- ' + typeof(req.body.OTP));
                                    console.log('value -- ' + typeof(OTPEachTicket));
                                    if(req.body.OTP == OTPEachTicket.id){
                                        res.json({
                                            status: 'Success',
                                            message: 'Thanh cong...'
                                        });
                                        flag = true;
                                        break;
                                    }
                                }
                                
                                if(!flag){
                                    // Gửi thông báo xác nhận thất bại.
                                    res.json({
                                        status: 'Fail',
                                        message: 'That bai'
                                    });
                                }
                            } 
                        

                    });
                    
                    
                }
            });
        }
    });
};

/*
UsersController.signin = function (req, res) {
    console.log(req.body);
    Users.findOne({
        id: req.body.id
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.json({
                status: 'Fail',
                message: 'Tài khoản đăng nhập không tồn tại'
            });
        } else if (user) {
            // check if password matches
            if (user.password != req.body.password) {
                console.log(user.password);
                res.json({
                    status: 'Fail',
                    message: 'Mật khẩu sai'
                });
            } else {
                // if user is found and password is right, create a token
                var token = jwt.sign(user, secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.json({
                    status: 'OK',
                    message: 'Đăng nhập thành công',
                    token: token
                });
            }
        }
    });
};

*/
module.exports = CheckController;