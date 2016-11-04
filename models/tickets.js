var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO cần bổ sung thêm các trường thông tin
var ticketSchema = new Schema({
    id: Number,
    user: Number,
    device: Number,
    information: String
});

var Tickets = mongoose.model('Tickets', ticketSchema);
module.exports = Tickets;
