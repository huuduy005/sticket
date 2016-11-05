var Tickets = require('../models/tickets');

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
        id: 1,
        user: 2,
        device: 2,
        check_in: {},
        information: 'fdsfsdf'
    });
    ticket.save(function (err) {
        if (err) throw err;
        console.log('Ticket saved successfully');
        res.send({status: 'OK', message: 'Tạo vé thành công'});
    });
};

module.exports = TicketsController;