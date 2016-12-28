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
    var idEvent = randomstring.generate({length: numberChar, 
                    charset: 'alphabetic', capitalization: 'uppercase'});
    while(checkExitEvent(Events, idEvent))
    {
        idEvent = randomstring.generate({length: numberChar, 
                    charset: 'alphabetic', capitalization: 'uppercase'});
    }
    return idEvent;
}

EventsController.getAll = function (req, res) {
    Events.find({}, function (err, events) {
        if (err) throw err;
        res.json(events);
    });
};


EventsController.getAllEventOfUser = function (req, res) {
    Events.find({idAdmin: req.decoded._doc.idUser}, function (err, events) {
        if (err) throw err;
        res.json(events);
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
                console.log(event);
                // Create ticket, and res
                if(event.numberTicket > 0)
                {
                    var idUser = parseInt(req.decoded._doc.idUser);
                    var ticket = TicketsController.create(event.idEvent, idUser, event.information);

                    // Update tags and numberTicket for event
                    event.numberTicket = event.numberTicket - 1;
                    Events.update({_id: event._id}, event, function (err, place) {
                        if(err)
                            next(new Error(err));
                    });
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

/*
    Update information of the event
    + Object event
*/
EventsController.updateEvents = function (req, res) {
  // var event = new Events();
  // event = req.body.event;
  // Events.update({idEvent: event.idEvent}, event, function (err, place) {
  //     if(err)
  //         next(new Error(err));
  // });
  res.json({
      status: 'Success',
      message: 'Chỉnh sửa event thành công'
  });
};


module.exports = EventsController;
