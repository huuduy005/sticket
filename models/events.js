var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO cần bổ sung thêm các trường thông tin
var eventSchema = new Schema({
    idEvent: String,
    information: String,
    title: String,
    time: String,
    image: String,
    price: Number,
    date: Date,
    location: String,
    tags: [String],
    type: String,
    numberTicket: Number,
    idAdmin: Number
});

var Events = mongoose.model('Events', eventSchema);
module.exports = Events;
