var Events = require('../models/events');
var TicketsController = require('../controllers/tickets');
var randomstring = require('randomstring');

var EventsController = {};
var numberChar = 5;

function checkExitEvent(Events, idEvent) {
    Events.findOne({
        idEvent: idEvent
    }, function (err, event) {
        if (err) {
            next(new Error(err));
        } else {
            if (event) {
                return true;
            } else {
                return false;
            }
        }
    });
}

function generateIdEvent(Events) {
    var idEvent = randomstring.generate({
        length: numberChar,
        charset: 'alphabetic', capitalization: 'uppercase'
    });
    while (checkExitEvent(Events, idEvent)) {
        idEvent = randomstring.generate({
            length: numberChar,
            charset: 'alphabetic', capitalization: 'uppercase'
        });
    }
    return idEvent;
}

EventsController.getAll = function (req, res) {
    Events.find({}, function (err, events) {
        if (err) throw err;
        res.json({
            status: 'OK',
            message: 'OK',
            data: events
        });
    });
};


EventsController.getAllEventOfUser = function (req, res) {
    Events.find({idAdmin: req.decoded._doc.idUser}, function (err, events) {
        if (err) throw err;
        res.json({
            status: 'OK',
            message: 'OK',
            data: events
        });
    });
};

EventsController.getDetail = function (req, res) {
    var idEvent = req.params.idEvent;
    Events.findOne({
        idEvent: idEvent
    }, function (err, event) {
        if (err) {
            next(new Error(err));
        } else {
            if (event) {
                res.json({
                    status: 'OK',
                    message: 'OK',
                    data: event
                });
            } else {
                res.json({
                    status: 'Fail',
                    message: 'Không tồn tại Events'
                });
            }
        }
    });
};

EventsController.getContentEvent = function (req, res) {
    var idEvent = req.params.idEvent;
    Events.findOne({
        idEvent: idEvent
    }, function (err, event) {
        if (err) {
            next(new Error(err));
        } else {
            if (event) {
                res.render('event_view',
                    {
                        link_image: event.image,
                        title: event.title,
                        time: event.time,
                        text: event.information,
                        content: 'London is the capital city of England. It is the most populous city in the United Kingdom, with a metropolitan area of over 13 million inhabitants Standing on the River Thames, London has been a major settlement for two millennia, its history going back to its founding by the Romans, who named it Londinium'
                    });
            } else {
                res.json({
                    status: 'Fail',
                    message: 'Không tồn tại Events'
                });
            }
        }
    });
};

/*
 Create a event
 */
EventsController.create = function (req, res) {
    // Generation id for event
    var idEvent = generateIdEvent(Events);
    var event = new Events({
        idEvent: idEvent,
        information: req.body.information,
        title: req.body.title,
        image: req.body.image,
        price: parseInt(req.body.price),
        //date: req.body.date,
        location: req.body.location,
        tags: [],
        type: req.body.type,
        numberTicket: parseInt(req.body.numberTicket),
        idAdmin: req.decoded._doc.idUser
    });
    event.save(function (err) {
        if (err) throw err;
        console.log('Event saved successfully');
        res.send({status: 'OK', message: 'Tạo event thành công'});
    });
    return Events;
};


/*
 Buy ticket of the event
 req:
 + IdEvent:
 + IdUser: Who buy it?
 res:
 +
 */
////////////////////////// Con luu list ticket
EventsController.bookingTicket = function (req, res) {
    var idEvent = req.body.idEvent;
    Events.findOne({
        idEvent: idEvent
    }, function (err, event) {
        if (err) {
            next(new Error(err));
        } else {
            if (event) {
                //console.log(event);
                // Create ticket, and res
                if (event.numberTicket > 0) {
                    var idUser = parseInt(req.decoded._doc.idUser);
                    TicketsController.create(event.idEvent, idUser, event.information, function (ticket) {
                        console.log('event');
                        console.log(ticket);
                        if (ticket == null) {
                            res.json({
                                status: 'Fail',
                                message: 'Bạn đã có vé của sự kiện rồi'
                            });
                        }
                        else {
                            // Update tags and numberTicket for event
                            event.numberTicket = event.numberTicket - 1;
                            Events.update({_id: event._id}, event, function (err, place) {
                                if (err)
                                    next(new Error(err));
                            });
                            ticket.set('time', event.time, {strict: false});
                            ticket.set('title', event.title, {strict: false});
                            ticket.set('location', event.location, {strict: false});
                            res.json({
                                status: 'OK',
                                message: 'OK',
                                data: ticket
                            });
                        }
                    });
                } else {
                    res.json({
                        status: 'Fail',
                        message: 'Không thành công, do hết vé'
                    });
                }
            } else {
                res.json({
                    status: 'Fail',
                    message: 'Không tòn tại Events'
                });
            }
        }
    });
};

module.exports = EventsController;
