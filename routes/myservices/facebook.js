var express = require('express');
var request = require('request');
var router = express.Router();
var fs = require('fs');
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
                if (message.message.attachments) {
                    var attachments = message.message.attachments;
                    for (var attachment of attachments) {
                        if (attachment.type === 'location') {
                            var lat = attachment.payload.coordinates.lat;
                            var long = attachment.payload.coordinates.long;
                            console.log(lat + '-' + long);
                            sendMessage(senderId, 'Vị trí của bạn (' + lat + ', ' + long + ')');
                            sendBusAround(senderId, lat, long);
                        }
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

function sendBusAround(senderId, lat, long) {
    var URL = 'http://apicms.ebms.vn/businfo/getstopsinbounds/' + (long - 0.0025) + '/' + (lat - 0.0025 ) + '/' + (long + 0.0025) + '/' + (lat + 0.0025);
    console.log(URL);
    request({
        url: URL,
        json: true
    }, function (err, res, body) {
        var data = {
            recipient: {
                id: senderId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic"
                    }
                }
            }
        };
        var ele = [];
        for (var stop of body) {
            var info = {
                title: 'Trạm dừng ' + stop.Name,
                item_url: 'https://sticket.herokuapp.com',
                image_url: 'https://www.ticketdesign.com/wp-content/uploads/2014/05/ticket-logo-.003.jpg',
                subtitle: 'Địa bàn: ' + stop.Zone + '\nTuyến: ' + stop.Routes,
                buttons: [
                    {
                        type: "web_url",
                        url: "https://sticket.herokuapp.com",
                        title: "View Website"
                    }
                ]
            };
            ele.push(info);
        }
        data.message.attachment.payload.elements = ele;
        console.log(data);
        fs.writeFile("./fb.json", JSON.stringify(data), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {
                access_token: 'EAATnBNPBOEgBAAZBDnJg1dv3vbKvFal6Em5LLFP7mvGInJsHjUwcODngcVa15oIhTLO6wPOauq1cIeYiWYghvOBiVRWIscou2cigeFi3JiIe4WG8C206CqxprXKfblHRSoT52JBUxPczrasAUGkev7ZAxYD3D9PFOP5U3gQgZDZD',
            },
            method: 'POST',
            json: data
        });
        // res.send(data);
        // sendMessage(senderId,'Các trạm dừng gần bạn');
    });
}

router.get('/bus', function (req, res) {
    sendBusAround(123213, 10.756455759090029, 106.68196452856064);
    res.send('OK');
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

module.exports = router;
