var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    Types = mongoose.Types,
    SchemaString = mongoose.Schema.Types.String;

var alphabet = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";

var gen = function(len, cb) {
    len = len || 7;

    var base = alphabet.length;
    var output = [];

    for (var i = 0; i < len; i++) {
        output.push(alphabet[Math.floor(Math.random() * base)]);
    }

    cb(null, output.join(""));
};

function SkuString(key, options) {
    this.generator = gen;

    this.len = options.len || 7;

    if (options.generator) {
        delete options.generator;
    }
    SchemaString.call(this, key, options);
}

SkuString.prototype.__proto__ = SchemaString.prototype;

Schema.Types.SkuString = SkuString;
Types.SkuString = String;

module.exports = exports = SkuString;
