/**
 * Created by huudu on 18/10/2016.
 */
/**
 * Created by huudu on 18/10/2016.
 */
var express = require('express');
var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var router = express.Router();
var Movies = require('../models/movies');

/* GET List movies. */
router.get('/', function (req, res, next) {
    res.send('Hello');
});
var mID = 5000;
/*Lấy danh sách phim đang chiếu galaxy*/
router.get('/galaxy', function (req, res, next) {
    var URL = 'https://www.galaxycine.vn/phim-dang-chieu';
    var mCookies = request.jar();
    var mCollecMovies = [];
    var collectAFilm = function (url) {
        request({
            uri: url,
            jar: mCookies
        }, function (err, response, body) {
            var $ = cheerio.load(body);
            var img = $('.film-info .thumb').find('img').attr('src');
            var info = $('.film-info article').children();
            var aMovie = {
                ID: mID++,
                Title: $(info[0]).text().trim(),
                Year: 2016,
                Rated: -1,//Number($(info[1]).text().trim()),
                Released: new Date("28 Oct 2016"),
                Runtime: 120,
                Genre: "Action, Crime, Drama",
                Director: "Ron Howard",
                Writer: "Dan Brown (based on the novel by), David Koepp (screenplay)",
                Actors: "Ben Foster, Tom Hanks, Sidse Babett Knudsen, Felicity Jones",
                Plot: "",
                Language: "English",
                Country: "USA, Japan, Turkey, Hungary",
                Poster: img,
                Type: "movie"
            };
            Movies.create(aMovie, function (err, movie) {
                if (err) console.log(err);
                else console.log(movie);
            });
            aMovie.Link = url;
            mCollecMovies.push(aMovie);
            gg();
        });
    };
    var calls = [];
    var gg = function () {
        if (calls.length == 0) {
            fs.writeFile("./movies.json", calls, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });

            res.send(mCollecMovies);
            return;
        }
        var mURL = calls.pop();
        console.log(mURL);
        collectAFilm(mURL);
    };
    request({
        uri: URL,
        jar: mCookies
    }, function (err, response, body) {
        var $ = cheerio.load(body);
        $('#main .container .inner').find('li').each(function () {
            var mURl = $(this).find('a').attr('href');
            calls.push(mURl);
        });
        gg();
    });
});

module.exports = router;
