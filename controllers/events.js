var event = require('../models/events');

var EventsController = {};

EventsController.getAll = function (req, res, next) {
    res.send('Test');
};

module.exports = EventsController;