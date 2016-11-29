var Devices = require('../models/devices');

var DevicesController = {};

DevicesController.getAll = function (req, res) {
    var admin = req.body.admin;
    if (admin === 'huuduy' || admin === 'thanhduong') {
        res.send('OK');
    }
    res.status(401).send('Error - Devices');
};

DevicesController.get = function (req, res) {

};

DevicesController.sign = function (req, res) {
    var mac = req.body.mac;
    if (mac){
        res.send(mac);
    } else {
        res.send('Lỗi không nhận diện được!');
    }
};

DevicesController.updateUser = function (req, res) {

};

module.exports = DevicesController;