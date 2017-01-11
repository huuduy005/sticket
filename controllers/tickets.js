var crypto = require('crypto');
var constants = require('constants');
var cryptico = require('cryptico');
var NodeRSA = require('node-rsa');
var path = require("path");
var fs = require("fs");
var randomstring = require('randomstring');
var Tickets = require('../models/tickets');

var TicketsController = {};
var numberChar = 5;

function checkExitTicket(Tickets, idEvent, idTicket) {
    Tickets.findOne({
        idEvent: idEvent,
        idTicket: idTicket
    }, function (err, ticket) {
        if (err) {
            next(new Error(err));
        } else {
            if (ticket) {
                return true;
            } else {
                return false;
            }
        }
    });
}

function generateIdTicket(Tickets, idEvent) {
    var idTicket = idEvent + randomstring.generate({length: 5, charset: 'numeric'});
    while (checkExitTicket(Tickets, idEvent, idTicket)) {
        idTicket = idEvent + randomstring.generate({length: 5, charset: 'numeric'});
    }
    return idTicket;
}


//Lấy danh sách vé của một user
TicketsController.getAllTicketOfUser = function (req, res) {
    Tickets.find({idUser: req.decoded._doc.idUser}, function (err, tickets) {
        if (err) throw err;
        res.json({
            status: 'OK',
            message: 'OK',
            data: tickets
        });
    });
};

//Lấy thông tin chi tiết của một vé
TicketsController.get = function (req, res) {
    Tickets.findOne({idTicket: req.params.idTicket}, function (err, ticket) {
        if (err) throw err;
        //ticket.check_in.by = 10;
        res.json({
            status: 'OK',
            message: 'OK',
            data: ticket
        });
    })
};

TicketsController.create = function (idEvent, idUser, infor, callback) {
    var result = null;
    // Check one ticket
    Tickets.findOne({
        idEvent: idEvent,
        idUser: idUser
    }, function (err, tic) {
        if (err) throw err;
        console.log(tic);
        if (tic == null) {
            var idTicket = generateIdTicket(Tickets, idEvent);
            var ticket = new Tickets({
                idTicket: idTicket,
                idUser: idUser,
                device: null,
                idEvent: idEvent,
                check_in: null,
                information: infor,
                in: false,
                out: false
            });
            ticket.save(function (err) {
                if (err) throw err;
                console.log('Ticket saved successfully');
                //res.send({status: 'OK', message: 'Tạo vé thành công'});
            });
            result = ticket;
            console.log('result');
            console.log(result);
        }
        callback(result);
    });
};


TicketsController.check = function (req, res) {
    var text = 'a2welna6yzqh2odn';
    var EncryptionResult = cryptico.encrypt(text, config.publickey);
    res.send({
        string: text,
        encrypt: EncryptionResult.cipher,
        publickey: config.publickey
    });
};


TicketsController.GenRSA = function (req, res) {
    var text = "a2welna6yzqh2odn";
    var encrypted = encryptByRSA(text);
    res.send({
        plain: text,
        encrypt: encrypted,
        crypto: encryptStringWithRsaPublicKey(text)
    });
};

TicketsController.checkRSA = function (req, res) {
    var encrypted = req.body.code;
    console.log(encrypted);
    var DecryptionResult = decryptStringWithRsaPrivateKey(encrypted);//decryptByRSA(encrypted);
    console.log(DecryptionResult.length); // 11
    console.log(DecryptionResult.replace('\0', '').length); // 10
    console.log(DecryptionResult.replace(/\0/g, '').length); // 8
    DecryptionResult = DecryptionResult.replace(/\0/g, '');
    res.send({
        encrypt: encrypted,
        decrypt: DecryptionResult
    });
};

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
var RSAKey = null;
var generate_key = function () {
    // The passphrase used to repeatably generate this RSA key.
    var PassPhrase = "The Moon is a Harsh Mistress.";
    // The length of the RSA key, in bits.
    var Bits = 2048;
    RSAKey = cryptico.generateRSAKey(PassPhrase, Bits);
    PublicKeyString = cryptico.publicKeyString(RSAKey);
    console.log(PublicKeyString);
    // fs.writeFile("./public.txt", PublicKeyString, function (err) {
    //     if (err) return console.log(err);
    //     console.log("The file was saved!");
    // });

    var PlainText = "a2welna6yzqh2odn";

    var EncryptionResult = RSAKey.encrypt(PlainText);
    var DecryptionResult = cryptico.decrypt(EncryptionResult.cipher, RSAKey);

    console.log(DecryptionResult.plaintext);
}


var init = function () {
    RSAKey = new NodeRSA();
    // console.log(RSAKey);
    RSAKey.importKey(config.publickey, 'public');
    RSAKey.importKey(config.privatekey, 'pkcs8-private');
    // console.log('Init RSAKey done');
};

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


var generate_key_firsttime = function () {
    var Bits = 1024;
    RSAKey = new NodeRSA({b: Bits});
    console.log(RSAKey.exportKey('public'));
    console.log(RSAKey.exportKey('pkcs8-private'));
}
// generate_key_firsttime();

var encryptStringWithRsaPublicKey = function (toEncrypt) {
    var publicKey = config.publickey;
    var options = {
        key: publicKey,
        padding: constants.RSA_NO_PADDING
    };
    var buffer = new Buffer(toEncrypt);
    var encrypted = crypto.publicEncrypt(options, buffer);
    return encrypted.toString("base64");
};

var decryptStringWithRsaPrivateKey = function (toDecrypt) {
    var privateKey = config.privatekey;
    var options = {
        key: privateKey,
        padding: constants.RSA_NO_PADDING
    };
    var buffer = new Buffer(toDecrypt, "base64");
    var decrypted = crypto.privateDecrypt(options, buffer);
    return decrypted.toString("utf8");
};

module.exports = TicketsController;
