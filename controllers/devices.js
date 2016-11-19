var Devices = require('../models/devices');

var DevicesController = {};

DevicesController.getAll = function (req, res, next) {
    res.send('Devices');
};

DevicesController.get = function (req, res) {

};

DevicesController.updateUser = function (req, res) {

};

DevicesController.create = function (req, res) {
	console.log(req.body);
    var device = new Devices({
        id: req.body.id,
        MAC: req.body.MAC,
        user: req.body.user
    });
    device.save(function (err) {
        if (err) throw err;
        console.log('MAC saved successfully');
        res.send({status: 'OK', message: 'Đã lưu MAC'});
    });
};



module.exports = DevicesController;