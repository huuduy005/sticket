var Events = require('../models/events');
var TicketsController = require('../controllers/tickets');

var EventsController = {};

var numberEvent = 1;

EventsController.getAll = function (req, res) {
    Events.find({}, function (err, events) {
        if (err) throw err;
        res.json(events);
    });
};


EventsController.getDetail = function (req, res, next) {
    var idEvent = req.params.idEvent;
    Events.findOne({
        idEvent: idEvent
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

/*
    Create a event
*/
EventsController.create = function (req, res) {
    // Generation id for event
    var idEvent = numberEvent++;

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
    numberTicket: parseInt(req.body.numberTicket)
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

EventsController.BookingTicket = function (req, res) {
    var idEvent = req.body.idEvent;
    Events.findOne({
        idEvent: idEvent
    }, function (err, event) {
        if (err) {
            next(new Error(err));
        } else {
            if (event) {

                // Create ticket, and res
                if(event.numberTicket > 0)
                {
                    var idUser = parseInt(req.decoded._doc.idUser);
                    var ticket = TicketsController.create(event.idEvent, idUser, event.information);                

                    // Update tags and numberTicket for event
                    var tags = [];
                    tags = event.tags;
                    console.log(tags);
                    event.tags.push(ticket.idTicket);
                    console.log(event.tags);
                    var numberTicket = event.numberTicket - 1;
                    Events.update({_id: event._id}, {$set: {tags: event.tags}, $set: {numberTicket: numberTicket}}, function (err, numUpdated) {
                        if(err)
                            next(new Error(err));
                    });
                    //console.log(event);
                    res.json(ticket);
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