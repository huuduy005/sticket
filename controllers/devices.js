var Devices = require('../models/devices');

var DevicesController = {};

DevicesController.getAll = function (req, res, next) {
    res.send('Devices');
};

module.exports = DevicesController;