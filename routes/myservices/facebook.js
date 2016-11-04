var express = require('express');
var request = require('request');
var router = express.Router();
var Tiki = require('./../util/tiki');

var code_verify = 'hulo005';
//Facebook xác thực webhook
router.get('/', function (req, res) {
    if (req.query['hub.verify_token'] === code_verify) {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});
//Nhận tin nhắn từ facebook
router.post('/', function (req, res) {
    var entries = req.body.entry;
    console.log(entries);
    mess.push(entries);
    for (var entry of entries) {
        var messaging = entry.messaging;
        for (var message of messaging) {
            var senderId = message.sender.id;
            if (message.message) {
                // If user send text
                if (message.message.text) {
                    var text = message.message.text;
                    sendMessBySimi(senderId, text);
                }
                if (message.attachments) {
                    if (message.attachments.type === 'location') {
                        var lat = message.attachments.coordinates.lat;
                        var long = message.attachments.coordinates.long;
                        sendMessage(senderId, 'Vị trí của bạn (' + lat + ', ' + long + ')');
                    }
                }
            }
        }
    }
    res.status(200).send("OK");
});

router.get('/tiki', function (req, res) {
    var r = Tiki.check('https://tiki.vn/may-anh-canon-700d-va-lens-18-55-stm-p114593.html');
    res.send(r);
});

var mess = [];
router.get('/mess', function (req, res) {
    res.send(mess);
});

var mCookies = request.jar();
var uid = '';
function getCookie() {
    request({
        url: 'http://simsimi.com/storygame/main',
        jar: mCookies
    }, function (err, res, body) {
        request({
            url: 'http://simsimi.com/getUUID',
            jar: mCookies
        }, function (err, res, body) {
            var data = JSON.parse(body);
            uid = data.uuid;
        });
    });
}

// getCookie();

function sendMessBySimi(senderId, text) {
    var URI = 'http://simsimi.com/getRealtimeReq?uuid=' + uid + '&lc=vi&ft=1&reqText=' + text + '&status=W';
    URI = encodeURI(URI);
    request({
        url: URI,
        jar: mCookies
    }, function (err, res, body) {
        var data = JSON.parse(body);
        if (data.status === 200) {
            var mess = data.respSentence;
            sendMessage(senderId, mess);
        } else {
            sendMessage(senderId, 'Xin lỗi mình không hiểu câu nói của bạn!!! :)');
            getCookie();
        }
    });
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
}

module.exports = router;
