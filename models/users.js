var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
    id: Number,
    password: String,
    name: String,
    admin: Boolean
});

// the schema is useless so far
// we need to create a model using it
var Users = mongoose.model('Users', userSchema);

// make this available to our users in our Node applications
module.exports = Users;
