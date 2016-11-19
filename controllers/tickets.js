var Tickets = require('../models/tickets');
var jwt = require('jsonwebtoken');
var config = require('../config');
var secret = config.secret;

var TicketsController = {};

TicketsController.getAll = function (req, res, next) {
    Tickets.find({}, function (err, tickets) {
        if (err) throw err;
        res.send(tickets);
    });
};

TicketsController.get = function (req, res) {
    Tickets.findOne({id: req.params.id}, function (err, ticket) {
        if (err) throw err;
        ticket.check_in.by = 10;
        res.send(ticket);
    })
};

TicketsController.create = function (req, res) {
    var ticket = new Tickets({
        id: req.body.id,
        user: req.body.user,
        device: {},
        check_in: {},
        information: 'fdsfsdf'
    });
    ticket.save(function (err) {
        if (err) throw err;
        console.log('Ticket saved successfully');
        res.send({status: 'OK', message: 'Tạo vé thành công'});
    });
};

TicketsController.buy = function (req, res) {
    var token = req.body.token
    //console.log(req.body.token);
    jwt.verify(token, secret, function (err, decoded) {
        console.log(decoded._doc.id);
            if (err) {
                console.log('Lỗi decoded');
                throw err;
            } else {
                if(!decoded) {
                    res.json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    //next();
                    // Find and set infor of the ticket.
                    Tickets.findOne({id: req.body.id}, function(err, ticket) {
                        if(err) 
                            throw err;
                        else {
                            // Not exits the ticket or owned
                            if(!ticket) ///////// Trường hợp này ko thể có.
                                res.json({
                                    success: false,
                                    message: 'Not exits the ticket or owned.'
                                });
                            // Xác nhận thanh toán thành công
                            var pay = true;
                            console.log(ticket);
                            console.log(decoded._doc.id);
                            console.log(typeof(ticket.user));
                            console.log(typeof(decoded._doc.id));
                            if(pay) {
                                Tickets.update({_id: ticket._id}, {$set: {user: decoded._doc.id}}, function (err, numUpdated) {
                                    if(err) {

                                        console.log('Erros update!!!');
                                        res.json({
                                            success: false,
                                            message: 'Erros!'
                                        });
                                        throw err;
                                    } else {
                                         res.json({
                                            success: true,
                                            message: 'Successfully buy tickets.'
                                        });
                                    }
                                });           
                            }
                        }
                    });
                }
            }
        });
};

module.exports = TicketsController;