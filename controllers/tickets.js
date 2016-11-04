var Tickets = require('../models/tickets');

var TicketsController = {};

TicketsController.getAll = function (req, res, next) {
    res.send('Devices');
};

module.exports = TicketsController;