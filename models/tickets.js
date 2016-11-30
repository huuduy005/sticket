var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO cần bổ sung thêm các trường thông tin
var ticketSchema = new Schema({
    idTicket: String,
    idUser: Number,
    device: String,
    idEvent: String,
    time: Date,
    by: Number,
    in: Boolean,
    out: Boolean,
    information: String
});

var Tickets = mongoose.model('Tickets', ticketSchema);
module.exports = Tickets;
