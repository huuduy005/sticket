var crypto = require('crypto');
var constants = require('constants');
var cryptico = require('cryptico');
var path = require("path");
var fs = require("fs");
var randomstring = require('randomstring');
var Tickets = require('../models/tickets');
var Events = require('../models/events');

var TicketsController = {};

function checkExitTicket(Tickets, idEvent, idTicket) {
    Tickets.findOne({
        idEvent: idEvent,
        idTicket: idTicket
    }, function (err, ticket) {
        if (err) {
            next(new Error(err));
        } else {
            if (ticket) {
                return true;
            } else {
                return false;
            }
        }
    });
}

function generateIdTicket(Tickets, idEvent) {
    var idTicket = idEvent + randomstring.generate({length: 5, charset: 'numeric'});
    while (checkExitTicket(Tickets, idEvent, idTicket)) {
        idTicket = idEvent + randomstring.generate({length: 5, charset: 'numeric'});
    }
    return idTicket;
}

//Lấy danh sách vé của một user
TicketsController.getAllTicketOfUser = function (req, res) {
    Tickets.find({idUser: req.decoded._doc.idUser}, function (err, tickets) {
        if (err) throw err;
        else {
            var len = tickets.length;
            var curIdx = 0;
            var newTickets = [];
            tickets.forEach(function (ticket) {
                Events.findOne({ idEvent: ticket.idEvent}, function (err, event) {
                    if (err) throw err;
                    else {
                        console.log(event.time);
                        ticket.set('time', event.time, {strict: false});
                        ticket.set('title', event.title, {strict: false});
                        ticket.set('location', event.location, {strict: false});
                        newTickets.push(ticket);
                        ++curIdx;
                        if (curIdx == len){
                            res.json({
                                status: 'OK',
                                message: 'OK',
                                data: newTickets
                            });
                        }
                    }
                });
            });
        }
    });
};

//Lấy thông tin chi tiết của một vé
TicketsController.getATicket = function (req, res) {
    Tickets.findOne({idTicket: req.params.idTicket}, function (err, ticket) {
        if (err) throw err;
        res.json({
            status: 'OK',
            message: 'OK',
            data: ticket
        });
    })
};

TicketsController.create = function (idEvent, idUser, infor, callback) {
    var result = null;
    // Check one ticket
    Tickets.findOne({
        idEvent: idEvent,
        idUser: idUser
    }, function (err, tic) {
        if (err) throw err;
        console.log(tic);
        if (tic == null) {
            var idTicket = generateIdTicket(Tickets, idEvent);
            var ticket = new Tickets({
                idTicket: idTicket,
                idUser: idUser,
                device: null,
                idEvent: idEvent,
                check_in: null,
                information: infor,
                in: false,
                out: false
            });
            ticket.save(function (err) {
                if (err) throw err;
                console.log('Ticket saved successfully');
            });
            result = ticket;
            console.log('result');
            console.log(result);
        }
        callback(result);
    });
};

module.exports = TicketsController;
