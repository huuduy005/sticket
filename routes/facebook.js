var express = require('express');
var request = require('request');
var router = express.Router();

var maxacminh = 'hulo005';
/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.query['hub.verify_token'] === maxacminh) {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});

var mess = '';
router.get('/mess', function (req, res, next) {
    res.send(mess);
});

router.post('/mess', function (req, res, next) {
    console.log(req.body);
    var entries = req.body.entry;
    for (var entry of entries) {
        var messaging = entry.messaging;
        for (var message of messaging) {
            var senderId = message.sender.id;
            console.log(senderId);
            if (message.message) {
                // If user send text
                if (message.message.text) {
                    var text = message.message.text;
                    console.log(text); // In tin nhắn người dùng
                    // sendMessage(senderId, "Tui là bot đây: " + text);
                }
            }
        }
    }
   res.status(200).send('OK');
});

router.post('/', function (req, res, next) {
    var entries = req.body.entry;
    for (var entry of entries) {
        var messaging = entry.messaging;
        for (var message of messaging) {
            var senderId = message.sender.id;
            mess += '\n';
            mess += senderId;
            if (message.message) {
                // If user send text
                if (message.message.text) {
                    var text = message.message.text;
                    mess += ' - ';
                    mess += text;
                    console.log(text); // In tin nhắn người dùng
                    sendMessage(senderId, "Tui là bot đây: " + text);
                    myVar = setInterval(function () {
                        autoSend(senderId);
                    }, 5000);
                }
            }
        }
    }

    res.status(200).send("OK");
});

var myVar;
var count = 0;
function autoSend(senderId) {
    if (count>10)
        clearInterval(myVar);
    sendMessage(senderId, 'Tui tự gửi cho bạn lần thứ: ' + count++);
}

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
    mess += 'đã gửi\n';
}
module.exports = router;
