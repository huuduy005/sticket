var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO cần bổ sung thêm các trường thông tin
var eventSchema = new Schema({
    id: Number,
    information: String,
    type: String
});

var Events = mongoose.model('Events', eventSchema);
module.exports = Events;