var Tickets = require('../models/tickets');
var jwt = require('jsonwebtoken');
//var config = require('../config');
var cryptico = require('cryptico');
var NodeRSA = require('node-rsa');

var CheckController = {};

var RSAKey = null;

init = function () {
    RSAKey = new NodeRSA({b: 1024});

    //RSAKey.importKey(config.publickey, 'public');
    //RSAKey.importKey(config.privatekey, 'pkcs8-private');
    console.log(RSAKey.exportKey('public'));
    console.log(RSAKey.exportKey('pkcs8-private'));
}
init();

var encryptByRSA = function (plainText) {
    var encrypted = RSAKey.encrypt(plainText, 'base64');
    return encrypted;
};

var decryptByRSA = function (encrypted) {
    // console.log(RSAKey);
    var decrypted = RSAKey.decrypt(encrypted, 'utf8');
    return decrypted;
};

CheckController.check = function (req, res) {
    var text = req.body.text;
    var EncryptionResult = encryptByRSA(text);
    res.send({
        string: text,
        encrypt: EncryptionResult,
        publickey: config.publickey
    });
};


/*
    Analyze to RSA, OPT, MAC, Time
*/
var sizeTicket = 10;
var sizeOTP = 10;
var sizeMAC = 12;
var sizeTime = 10;
var Analyze = function (str) {
    // idTicket(10) - OTP(10) - MAC(12) - Time(1)
    var decoded = decryptByRSA(str);
    var result = {
        idTicket: decoded.substr(0, sizeTicket),
        OTP: decoded.substr(sizeTicket, sizeOTP),
        MAC: decoded.substr(sizeTicket + sizeOTP, sizeMAC),
        time: decoded.substr(sizeTicket + sizeOTP + sizeMAC, sizeTime)
    }
    console.log(result);
    return result;
}


/*
    Create OTP from idTicket and Time
*/
var CreateOTP = function (idTicket, time) {
    return idTicket;
}


/*
    ----------------------
    req.body
    + idTicket:
    + MAC
    + OTP
    + time
    + trip
*/
CheckController.Approve = function (req, res) {
    /*
        TODO:
        + Từ req.body.code gọi Analyze để phân tích thành các thành phần RSA, OTP, MAC, Time
        + Giả mã RSA với key private => idTicket
    */
    var result = Analyze(req.body.text);
    var idTicket = result.idTicket;
    var MAC = result.MAC;
    var OTP = result.OTP;
    var time = result.time;
    var trip = req.body.trip;

    // Find Mac
    Tickets.findOne({
        idTicket: idTicket
    }, function (err, ticket) {
        if (err) next(new Error(err));
        if (!ticket) {
            res.json({
                status: 'Fail',
                message: 'Không tồn tại vé'
            });
        } else {
            var OTPTicket = CreateOTP(ticket.idTicket, time);
            console.log(OTPTicket);
            console.log(OTP);
            if(OTP !== OTPTicket) {
                res.json({
                    status: 'Fail',
                    message: 'OTP sai rồi'
                });
            } else {
                /* Check đi vào */
                if(trip === 'true')
                {
                    /* Vé đã được dùng*/
                    if(ticket.in === true)
                    {
                        res.json({
                            status: 'Fail',
                            message: 'Vé đã có người dùng'
                        });
                    } else {
                        /* Trường hơp vé đi vào lần thứ 2*/
                        if(ticket.device !== null && ticket.device !== MAC)
                        {
                            res.json({
                                status: 'Fail',
                                message: 'Vào lần hai sai MAC'
                            });
                        } else {
                            ticket.device = MAC;
                            ticket.in = true;
                            Tickets.findOneAndUpdate({_id: ticket._id}, ticket, function (err, place) {
                                if (err) next(new Error(err));
                            });

                            res.json({
                                status: 'Success',
                                message: 'Check in'
                            });
                        }
                    }
                    /* Check đi ra*/
                } else {
                    if(ticket.in === false)
                    {
                        /* Trường hợp này dự trù tình huống bị tấn công vao them ng*/
                        res.json({
                            status: 'Fail',
                            message: 'Vé chưa check đi vào nên không thể check đi ra'
                        });
                    } else {

                        ticket.in = false;

                        Tickets.findOneAndUpdate({_id: ticket._id}, ticket, function (err, place) {
                                if (err) next(new Error(err));
                        });
                        console.log(ticket);
                        res.json({
                            status: 'Success',
                            message: 'Check out'
                        });
                    }
                }
            }
        }

    });
};



module.exports = CheckController;
