var express = require('express');
var router = express.Router();

/*Controller*/
var TokensController = require('../controllers/tokens_access');
var UsersController = require('../controllers/users');
var EventsController = require('../controllers/events');
var TicketsController = require('../controllers/tickets');
var CheckController = require('../controllers/checks');

/*Home api*/
/*======================================================================================*/
router.all('/', function(req, res, next) {
    res.send('API Home - ' + req.method);
});
/*======================================================================================*/

/*User*/
/*======================================================================================*/
router.post('/sign-up', UsersController.signup);
router.post('/sign-in', UsersController.signin);
/*======================================================================================*/

/*Events*/
/*======================================================================================*/
router.get('/events', EventsController.getAll);
router.get('/event/:idEvent', EventsController.getDetail);
router.get('/event/:idEvent/content', EventsController.getContentEvent);
/*======================================================================================*/

router.get('/public-key', CheckController.get_public_key);
router.post('/check-in', CheckController.check_in);
/*======================================================================================*/

// route middleware to authenticate and check token
router.use(TokensController.middleware);

// Create event must signin
router.post('/event/create', EventsController.create);
// Booking ticket of the event
router.post('/event/booking', EventsController.bookingTicket);
// Get all event of the user
router.get('/events/getEventOfUser', EventsController.getAllEventOfUser);

/*Tickets*/
/*======================================================================================*/
router.get('/tickets', TicketsController.getAllTicketOfUser);
router.get('/ticket/:idTicket', TicketsController.getATicket);
// Get all ticket of the user
router.get('/tickets/getTicketOfUser', TicketsController.getAllTicketOfUser);
/*======================================================================================*/

module.exports = router;
