/**
 * Created by huudu on 06/01/2017.
 */
'use strict';

var crypto = require('crypto');

function intToBytes(num) {
    var bytes = [];

    for (var i = 7; i >= 0; --i) {
        bytes[i] = num & (255);
        num = num >> 8;
    }

    return bytes;
}

function hexToBytes(hex) {
    var bytes = [];
    for (var c = 0, C = hex.length; c < C; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
}

var hotp = {};

hotp.gen = function (key, opt) {
    key = key || '';
    opt = opt || {};
    var counter = opt.counter || 0;

    console.log('counet ' + counter);

    var p = 6;

    // Create the byte array
    var b = new Buffer(intToBytes(counter));

    var hmac = crypto.createHmac('sha1', new Buffer(key));

    // Update the HMAC with the byte array
    var digest = hmac.update(b).digest('hex');

    // Get byte array
    var h = hexToBytes(digest);

    // Truncate
    var offset = h[19] & 0xf;
    var v = (h[offset] & 0x7f) << 24 |
        (h[offset + 1] & 0xff) << 16 |
        (h[offset + 2] & 0xff) << 8 |
        (h[offset + 3] & 0xff);

    v = (v % 1000000) + '';

    return Array(7 - v.length).join('0') + v;
};

hotp.verify = function (token, key, opt) {
    opt = opt || {};
    var window = opt.window || 50;
    var counter = opt.counter || 0;

    for (var i = counter - window; i <= counter + window; ++i) {
        opt.counter = i;
        if (this.gen(key, opt) === token) {
            // We have found a matching code, trigger callback
            // and pass offset
            return {delta: i - counter};
        }
    }
    return null;
};

var totp = {};

totp.gen = function (key, opt) {
    opt = opt || {};
    var time = opt.time || 30;
    var _t = Date.now();

    if (opt._t) {
        if (process.env.NODE_ENV != 'test') {
            throw new Error('cannot overwrite time in non-test environment!');
        }
        _t = opt._t;
    }

    opt.counter = Math.floor((_t / 1000) / time);

    return hotp.gen(key, opt);
};

totp.mygen = function (key, mtime, opt) {
    opt = opt || {};
    var time = opt.time || 30;
    var _t = mtime;

    opt.counter = Math.floor(mtime);

    return hotp.gen(key, opt);
};

totp.verify = function (token, key, opt) {
    opt = opt || {};
    var time = opt.time || 30;
    var _t = Date.now();

    if (opt._t) {
        if (process.env.NODE_ENV != 'test') {
            throw new Error('cannot overwrite time in non-test environment!');
        }
        _t = opt._t;
    }

    opt.counter = Math.floor((_t / 1000) / time);

    return hotp.verify(token, key, opt);
};

module.exports.hotp = hotp;
module.exports.totp = totp;