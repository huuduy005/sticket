var Events = require('../models/events');

var EventsController = {};

EventsController.getAll = function (req, res) {
    Event.find({}, function (err, events) {
        if (err) throw err;
        res.json(events);
    });
};

EventsController.getDetail = function (req, res, next) {
    var id_event = req.params.id;
    Events.findOne({
        id: id_event
    }, function (err, event) {
        if (err) {
            next(new Error(err));
        } else {
            if (event) {
                res.json(event);
            } else {
                res.json({
                    status: 'Fail',
                    message: 'Không tòn tại Events'
                });
            }
        }
    });
};

EventsController.getByPage = function (req, res) {
    var num_page = req.params.id;
    res.send(num_page);
};
EventsController.get = function (req, res) {

};

EventsController.create = function (req, res) {

};

module.exports = EventsController;