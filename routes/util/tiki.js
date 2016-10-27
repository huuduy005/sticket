var request = require('request');
var cheerio = require('cheerio');

var Tiki = {};
Tiki.check = function (URL) {
    request({
        uri: URL
    }, function (err, response, body) {
        var $ = cheerio.load(body);
        var name = $('.item-name').text().trim();
        var price = $('.special-price-item').children().eq(1).text().trim();
        var result = name + ' - ' + price;
        console.log(result);
        return result;
    });
};

module.exports = Tiki;