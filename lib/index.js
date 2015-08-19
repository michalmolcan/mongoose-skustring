var mongoose = require('mongoose');
var SkuString = require('./generator');

var defaultSave = mongoose.Model.prototype.save;

mongoose.Model.prototype.save = function(cb) {
    if (typeof cb == "undefined") {
        cb = function() {};
    }

    if (this.isNew && this.sku === undefined) {
        var idType = this.schema.tree['sku'];

        if (idType === SkuString || idType.type === SkuString) {
            var idInfo = this.schema.path('sku');
            var retries = 50;
            var self = this;

            (function attemptSave() {
                idInfo.generator(idInfo.len, function(err, sku) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    self.sku = sku;
                    defaultSave.call(self, function(err, obj) {
                        if (err && err.code == 11000 && err.err.indexOf('sku') !== -1 && retries > 0) {
                            --retries;
                            attemptSave();
                        } else {
                            cb(err, obj);
                        }
                    });
                });
            })();

            return;
        }
    }

    defaultSave.call(this, cb);
};

module.exports = exports = SkuString;