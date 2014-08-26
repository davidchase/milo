(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
'use strict';

var qs = document.querySelector.bind(document);
var debounce = require('./lib/debounce');
var Simplegrid = function(options) {
    this.containerEl = qs(options.container);
    this.children = this.containerEl.children;
    this.positions = [];

    this.margin = options.margin || 6;
    this.padding = options.padding || 10;
    this.width = options.width || 220;

    this.buildGrid();
};

Simplegrid.prototype.calcTopPosition = function(index) {
    return index >= this.containerGrids ? this.positions[index - this.containerGrids] : 0;
};

Simplegrid.prototype.buildGrid = function() {
    var idx = 0;
    var length = this.children.length;

    this.containerWidth = this.containerEl.clientWidth;
    this.containerSpace = (this.containerWidth % (this.width + this.margin));
    this.containerGrids = (this.containerWidth - this.containerSpace) / (this.width + this.margin);

    for (idx; idx < length; idx++) {
        this.children[idx].style.cssText =
            'margin:' + this.margin / 2 + ';' +
            'padding:' + this.padding + ';' +
            'top:' + this.calcTopPosition(idx) + ';' +
            'left:' + (this.width + this.margin) * Math.round(idx % this.containerGrids) + ';' +
            'width:' + this.width + ';';

        this.positions.push(this.children[idx].offsetHeight + this.margin + this.children[idx].offsetTop);
    }
};



var executeAsync = function() {
    var simpleGrid = new Simplegrid({
        container: '.grid'
    });
    window.addEventListener('resize', debounce(function(e) {
        simpleGrid.buildGrid();
    }, 700));
};

window.addEventListener('load', executeAsync);
},{"./lib/debounce":1}]},{},[2])