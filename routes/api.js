var express = require('express');
var router = express.Router();

/*Controller*/
var TokensController = require('../controllers/tokens_access');
var UsersController = require('../controllers/users');
var EventsController = require('../controllers/events');
var DevicesController = require('../controllers/devices');
var TicketsController = require('../controllers/tickets');
var CheckController = require('../controllers/checks');

var uncode = function (req, res, next) {
  res.send('Vẫn đang thực hiện: ' + req.originalUrl);
};



/*Home api*/
/*======================================================================================*/
router.all('/', function (req, res, next) {
    res.send('API Home - ' + req.method);
});
/*======================================================================================*/

/*Devices*/
/*======================================================================================*/
router.get('/devices', DevicesController.getAll);
router.post('/devices/sign', DevicesController.sign);
/*======================================================================================*/

/*User*/
/*======================================================================================*/
router.get('/users', UsersController.getAll);
router.post('/sign-up', UsersController.signup);
router.post('/sign-in', UsersController.signin);
router.post('/change-password', uncode);
router.post('/reset-password', uncode);
router.post('/users/update', uncode)
/*======================================================================================*/

/*Events*/
/*======================================================================================*/
router.get('/events', EventsController.getAll);
router.get('/events?page=:id', EventsController.getByPage);
router.get('/event/:idEvent', EventsController.getDetail);
/*======================================================================================*/

/*Tickets*/
/*======================================================================================*/
router.get('/tickets/:idUser', TicketsController.getAllTicketOfUser);
router.get('/ticket/:idTicket', TicketsController.get);
router.post('/tickets', TicketsController.create);
/*======================================================================================*/



/*Test - sử dụng RSA thay cho OTP*/
router.post('/rsa', CheckController.check);
router.post('/tickets/rsa/gen', TicketsController.GenRSA);
router.post('/tickets/rsa/check', TicketsController.checkRSA);
/*======================================================================================*/

router.post('/authenticate', TokensController.authenticate);
// route middleware to authenticate and check token
router.use(TokensController.middleware);

// Create event must signin
router.post('/events/create', EventsController.create);

// Booking ticket of the event
router.post('/event/booking', EventsController.bookingTicket);

//router.get('/events/booking', EventsController.getAllEventOfUser);



//router.use(TokensController.checkAuthorizationEvent);

/*Check in -- out*/
/*======================================================================================*/
router.post('/checks', CheckController.Approve);
/*======================================================================================*/

// Update event
router.post('/event/:idEvent', EventsController.updateEvents);

module.exports = router;
