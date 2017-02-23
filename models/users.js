var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO cần bổ sung thêm các trường thông tin
var userSchema = new Schema({
    idUser: Number,
    password: String,
    email: String,
    name: String,
    information: String,
    admin: Boolean
});

var Users = mongoose.model('Users', userSchema);
module.exports = Users;
