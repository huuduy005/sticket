var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO cần bổ sung thêm các trường thông tin
var deviceSchema = new Schema({
    id: Number,
    MAC: String,
    user: ObjectId
});

var Devices = mongoose.model('Devices', deviceSchema);
module.exports = Devices;
