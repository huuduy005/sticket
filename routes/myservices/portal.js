var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var form_data = require('form-data');

/* GET users listing. */
router.get('/', function (req, res, next) {
    var URL = 'http://portal1.hcmus.edu.vn/Login.aspx';
    var mCookie = request.jar();

    request({
        url: 'http://portal1.hcmus.edu.vn/Login.aspx',
        jar: mCookie
    }, function (err, resp, body) {
        console.log(mCookie.getCookieString('http://portal1.hcmus.edu.vn/Login.aspx'));
        var $ = cheerio.load(body);
        console.log($('#__VIEWSTATE').attr('value'));
        var options = {
            method: 'POST',
            url: 'http://portal1.hcmus.edu.vn/Login.aspx',
            headers: {
                'cache-control': 'no-cache',
                cookie: mCookie.getCookieString('http://portal1.hcmus.edu.vn/Login.aspx'),
                'accept-language': 'vi-VN,vi;q=0.8,fr-FR;q=0.6,fr;q=0.4,en-US;q=0.2,en;q=0.2',
                'accept-encoding': 'gzip, deflate',
                referer: 'http://portal1.hcmus.edu.vn/Login.aspx',
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'content-type': 'application/x-www-form-urlencoded',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.89 Safari/537.36',
                'upgrade-insecure-requests': '1',
                origin: 'http://portal1.hcmus.edu.vn'
            },
            form: {
                __EVENTARGUMENT: '',
                __EVENTTARGET: '',
                __LASTFOCUS: '',
                __VIEWSTATE: $('#__VIEWSTATE').attr('value'),
                'ctl00$ContentPlaceHolder1$btnLogin': 'Đăng nhập',
                'ctl00$ContentPlaceHolder1$txtPassword': 'HuuDuy005lk#',
                'ctl00$ContentPlaceHolder1$txtUsername': '1312077'
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);

            request({
                url: 'http://portal1.hcmus.edu.vn',
                jar: mCookie
            }, function (error, response, body) {
                res.send({
                    cookie: mCookie,
                    html: body
                });
            });
        });
    });
});

module.exports = router;
