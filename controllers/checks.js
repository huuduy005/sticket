var Tickets = require('../models/tickets');
var jwt = require('jsonwebtoken');
//var config = require('../config');
var cryptico = require('cryptico');
var NodeRSA = require('node-rsa');

var crypto = require('crypto');
var constants = require('constants');
var mTOTP = require('./TOTP');

var CheckController = {};

var RSAKey = null;

init = function () {
    RSAKey = new NodeRSA({b: 1024});

    //RSAKey.importKey(config.publickey, 'public');
    //RSAKey.importKey(config.privatekey, 'pkcs8-private');
    // console.log(RSAKey.exportKey('public'));
    // console.log(RSAKey.exportKey('pkcs8-private'));
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
        //publickey: config.publickey
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
};


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
            if (OTP !== OTPTicket) {
                res.json({
                    status: 'Fail',
                    message: 'OTP sai rồi'
                });
            } else {
                /* Check đi vào */
                if (trip === 'true') {
                    /* Vé đã được dùng*/
                    if (ticket.in === true) {
                        res.json({
                            status: 'Fail',
                            message: 'Vé đã có người dùng'
                        });
                    } else {
                        /* Trường hơp vé đi vào lần thứ 2*/
                        if (ticket.device !== null && ticket.device !== MAC) {
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
                    if (ticket.in === false) {
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

/*========================================================================================*/
var config = {
    publickey: '-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQClv/9l3VHkyiHM3Of9dAnUX8d7\n' +
    'xQk8s1AGuGorUIQ3v+MGMCgiGH16pb7UXCGK+6KkT1dlSl8UD01AtAHapjz1nbh1\n' +
    'KSJ6kVyiFBDpJIpWgE0CY1ehQn/uxZVldItmA2+RDU3GAVic/vlpdKA4lHMTMEsE\n' +
    'IjgodSihM4xLEWoW2wIDAQAB\n' +
    '-----END PUBLIC KEY-----',
    privatekey: '-----BEGIN PRIVATE KEY-----\n' +
    'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAKW//2XdUeTKIczc\n' +
    '5/10CdRfx3vFCTyzUAa4aitQhDe/4wYwKCIYfXqlvtRcIYr7oqRPV2VKXxQPTUC0\n' +
    'AdqmPPWduHUpInqRXKIUEOkkilaATQJjV6FCf+7FlWV0i2YDb5ENTcYBWJz++Wl0\n' +
    'oDiUcxMwSwQiOCh1KKEzjEsRahbbAgMBAAECgYA7a9yc4T5Fvm1lq2CEDcCkYX37\n' +
    'kkTgfQxYjG6Lfr8X2XQDOOp6Zrs9aAREz46668GAFG2pg4MYhu/UHXR4tZYuhNGT\n' +
    'BZrkfg2565Wl1uBh2BteQ2MPRoz+jR+N8cEufAQmEjKMWUVxi+TPNEbJchlIjM21\n' +
    'JgkNZtGF2osNWDRqWQJBAP5Xc2U7iZE+TmvKh7XqYAmVWW5WZl0rlwZwOPkGzdu7\n' +
    'UDDzciWQXK6Af0/WYuROLNSzwsHvNY0euSJ2KsxGtRcCQQCm1KtCrWCK8PIMU3vZ\n' +
    'W+jnY9Vh5/oaGHUkgkoo3vOlZ1O9WN9Zqkzfqa8LEC6RRJxfmQViyfDp8kFILWPd\n' +
    'm47dAkEAw89h2OMQUxCr4VKoToZlb5taoZbE8h/4Ao3tXtM9M1ivMTCLhZ3xrKri\n' +
    '2P1NX0VMQGkwnIvkJ4QqtfxRkLky+wJBAJYZOYzgGMBpUB0u73r8amvlMpLH+AmK\n' +
    'f7q9TqO/FE94y6rMTweJZWjGbiryADPLGzYXovTi49JYl8usqvEziDECQAz4i7o1\n' +
    'GIrs/TMxN++0UKIHrqQRrMbA8IcT+8Q1OACTb04tVCcwjsuvCII5qvgBZy28n+k6\n' +
    '0L5pJUImIbXLzoE=\n' +
    '-----END PRIVATE KEY-----'
};

var decryptStringWithRsaPrivateKey = function (toDecrypt) {
    var privateKey = config.privatekey;
    var options = {
        key: privateKey,
        padding: constants.RSA_NO_PADDING
    };
    var decrypted;

    try {
        var buffer = new Buffer(toDecrypt, "base64");
        decrypted = crypto.privateDecrypt(options, buffer);
    } catch (err) {
        /*Lỗi khi giải mã RSA, có thể không phải mã RSA*/
        return "error";
    }

    return decrypted.toString("utf8");
};

decodeRSA = function (code) {
    var DecryptionResult = decryptStringWithRsaPrivateKey(code);
    if (DecryptionResult === "error") {
        return {error: true};
    }
    DecryptionResult = DecryptionResult.replace(/\0/g, '');
    console.log(DecryptionResult);
    /*decode format*/
    var dd = {
        idTicket: "GDGD",
        OTP: "DFDFF",
        time: 52316641,
        MAC: "MDMSMSMD"
    };

    try {
        var result = JSON.parse(DecryptionResult);
    } catch (err) {
        /*Mã nhận được không đúng cấu trúc JSON*/
        return {error: true};
    }

    return result;
};

CheckController.check_in = function (req, res) {
    console.log('Begin');
    var IsCheckIn;
    if (req.body.checkCode === "true")
        IsCheckIn = true;
    else IsCheckIn = false;

    var result = decodeRSA(req.body.code);
    console.log(result);
    console.log(IsCheckIn);
    if (result.error) {
        res.json({
            status: "INVALID",
            message: "Mã xác thực cung cấp không hợp lệ!"
        });
        return;
    }

    /*Check*/
    var mOTP = mTOTP.totp.mygen(result.idTicket, result.time);
    if (mOTP !== result.OTP) {
        res.json({
            status: "FAIL",
            message: "Mã xác thực không đúng"
        });
    } else {
        Tickets.findOne({
            idTicket: result.idTicket
        }, function (err, ticket) {
            if (err) next(new Error(err));
            if (ticket) {
                console.log("Tới bước tìm vé");
                /*Check-in lượt đi vào*/
                if (IsCheckIn) {
                    /*Trường hợp vé chưa được check-in*/
                    if (ticket.device === null) {
                        ticket.device = result.MAC;
                        ticket.in = true;
                        ticket.save(function (err) {
                            if (err) throw err;
                            console.log('Mã vé check-in thành công');
                            res.json({
                                status: 'SUCCESS',
                                message: 'Mã vé Check in thành công'
                            });
                        });
                    } else {/*Đã check-in*/
                        if (ticket.device !== result.MAC) {
                            res.json({
                                status: 'FAIL',
                                message: 'Thiết bị xác thực không đúng với quá trình đăng kí.'
                            });
                        }
                        if (ticket.in === true) {
                            res.json({
                                status: "VERIFIED",
                                message: "Mã vé đã được check in"
                            });
                        } else if (ticket.out === true) {
                            ticket.in = true;
                            ticket.out = false;
                            ticket.save(function (err) {
                                if (err) throw err;
                                console.log('Mã vé xác thực vào hợp lệ (đã check-in)');
                                res.json({
                                    status: 'SUCCESS',
                                    message: 'Mã vé hợp lệ (đã check-in)'
                                });
                            });
                        } else {
                            res.json({
                                status: 'FAIL',
                                message: 'Logic có vấn đề'
                            });
                        }
                    }
                }
                /*Check-out lượt đi ra*/
                else {
                    /*Chắn chắn mã vé đã được check-in*/
                    if (ticket.device === null) {
                        res.json({
                            status: "FAIL",
                            message: "Mã vé chưa được check-in."
                        });
                    } else {
                        if (ticket.out === false && ticket.in === true) {
                            ticket.in = false;
                            ticket.out = true;
                            ticket.save(function (err) {
                                if (err) throw err;
                                console.log('Mã vé check-out thành công');
                                res.json({
                                    status: "SUCCESS",
                                    message: "Mã vé đã xác nhận việc ra ngoài sự kiện."
                                });
                            });
                        } else {
                            res.json({
                                status: "FAIL",
                                message: "Không đúng logic."
                            });
                        }
                    }
                }
            } else {
                res.json({
                    status: "FAIL",
                    message: "Mã vé không tồn tại"
                });
            }
        });
    }
};

module.exports = CheckController;
