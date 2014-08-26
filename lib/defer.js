'use strict';
module.exports = function(func) {
    if (typeof func !== 'function') {
        throw new TypeError('must be a function');
    }
    var args = Array.prototype.slice.call(arguments, 1);
    return setTimeout(function() {
        func.apply(undefined, args);
    }, 1);
};