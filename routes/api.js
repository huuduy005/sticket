var express = require('express');
var router = express.Router();

/*Controller*/
var TokensController = require('../controllers/tokens_access');
var UsersController = require('../controllers/users');
var EventsController = require('../controllers/events');
var DevicesController = require('../controllers/devices');
var TicketsController = require('../controllers/tickets');

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
router.get('/events/:id', EventsController.getDetail);
router.post('/events/create', EventsController.create);
/*======================================================================================*/

/*Tickets*/
/*======================================================================================*/
router.get('/tickets', TicketsController.getAll);
router.get('/tickets/:id', TicketsController.get);
router.post('/tickets', TicketsController.create);



/*Test - sử dụng RSA thay cho OTP*/
router.post('/tickets/rsa', TicketsController.check);
router.post('/tickets/rsa/gen', TicketsController.GenRSA);
router.post('/tickets/rsa/check', TicketsController.checkRSA);
/*======================================================================================*/

router.post('/authenticate', TokensController.authenticate);
// route middleware to authenticate and check token
router.use(TokensController.middleware);

// Booking ticket of the event
router.post('/events/booking', EventsController.BookingTicket);

module.exports = router;
