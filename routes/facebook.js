var express = require('express');
var router = express.Router();

var maxacminh = 'hulo005';
/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.query['hub.verify_token'] === maxacminh) {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

var mess;
router.get('/mess', function (req, res, next){
    res.send(mess);
});

router.post('/', function (req, res, next) {
    var entries = req.body.entry;
    mess = entries;
    // for (var entry of entries) {
    //     var messaging = entry.messaging;
    //     for (var message of messaging) {
    //         var senderId = message.sender.id;
    //         if (message.message) {
    //             // If user send text
    //             if (message.message.text) {
    //                 var text = message.message.text;
    //                 console.log(text); // In tin nhắn người dùng
    //                 sendMessage(senderId, "Tui là bot đây: " + text);
    //             }
    //         }
    //     }
    // }

    res.status(200).send("OK");
});

function sendMessage(senderId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: 'EAATnBNPBOEgBAAZBDnJg1dv3vbKvFal6Em5LLFP7mvGInJsHjUwcODngcVa15oIhTLO6wPOauq1cIeYiWYghvOBiVRWIscou2cigeFi3JiIe4WG8C206CqxprXKfblHRSoT52JBUxPczrasAUGkev7ZAxYD3D9PFOP5U3gQgZDZD',
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: message
            },
        }
    });
}
module.exports = router;