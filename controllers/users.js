var Users = require('../models/users');
var jwt = require('jsonwebtoken');
var config = require('../config');
var secret = config.secret;

var UsersController = {};

UsersController.getAll = function (req, res) {
    Users.find({}, function (err, users) {
        if (err) throw err;
        console.log(users);
        res.send(users);
    });
};

UsersController.signup = function (req, res) {
    console.log(req.body);
    Users.findOne({
        id: req.body.id
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            // create a sample user
            var acc = new Users({
                id: req.body.id,
                name: req.body.name,
                password: req.body.password,
                information: 'None',
                admin: false
            });
            acc.save(function (err) {
                if (err) throw err;
                console.log('User saved successfully');
                res.send({status: 'OK', message: 'Đăng kí thành công'});
            });
        } else {
            console.log(user);
            res.send({status: 'FAIL', message: 'Tên tài khoản đã tồn tại'});
        }
    });
};

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

module.exports = UsersController;