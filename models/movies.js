var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var movieSchema = new Schema({
    ID: Number,
    Title: String,
    Year: Number,
    Rated: Number,
    Released: Date,
    Runtime: Number,
    Genre: String,
    Director: String,
    Writer: String,
    Actors: String,
    Plot: String,
    Language: String,
    Country: String,
    Poster: String,
    Type: String
});

// the schema is useless so far
// we need to create a model using it
var Movies = mongoose.model('Movies', movieSchema);

// make this available to our users in our Node applications
module.exports = Movies;
