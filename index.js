'use strict';
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
var Bloccs = function() {
    this.config = {};
};
var BloccsProto = Bloccs.prototype;
BloccsProto.layout = function() {};
BloccsProto.unBind = function() {};
BloccsProto.sortElements = function() {};
BloccsProto.fullLayoutUpdate = function() {};
BloccsProto.getItemWidth = function() {};