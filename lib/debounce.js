'use strict';
module.exports = function debounce(fn, threshold, isAsap) {
    var timeout, result;

    var debounced = function() {
        var args = arguments;
        var context = this;

        var delayed = function() {
            if (!isAsap) {
                result = fn.apply(context, args);
            }
            timeout = null;
        };
        if (timeout) {
            clearTimeout(timeout);
        } else if (isAsap) {
            result = fn.apply(context, args);
        }
        timeout = setTimeout(delayed, threshold);
        return result;
    };
    debounced.cancel = function() {
        clearTimeout(timeout);
    };
    return debounced;
};