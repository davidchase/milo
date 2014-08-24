"use strict";
var internals = {};
internals.classRegex = function(className) {
    return new RegExp('(^|\\s+)' + className + '(\\s+|$)');
};
internals.extend = function(obj) {
    var arr = [];
    // create true array from arguments
    arr = arr.slice.call(arguments, 1);
    arr.forEach(function(source) {
        if (source) {
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    obj[prop] = source[prop];
                }
            }
        }
    });
    return obj;
};
internals.now = Date.now || function() {
    return new Date().getTime();
};

internals.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
        previous = options.leading === false ? 0 : internals.now();
        timeout = null;
        result = func.apply(context, args);
        context = args = null;
    };
    return function() {
        var now = internals.now();
        if (!previous && options.leading === false) {
            previous = now;
        }
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
            context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};
var Bloccs = function() {
    this.config = {};
};
var BloccsProto = Bloccs.prototype;
BloccsProto.layout = function() {};
BloccsProto.unBind = function() {};
BloccsProto.sortElements = function() {};
BloccsProto.fullLayoutUpdate = function() {};
BloccsProto.getItemWidth = function() {};