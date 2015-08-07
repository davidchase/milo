(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var debounce = require('./lib/debounce');
var qs = document.querySelector.bind(document);
var MiloGrid = function(options) {
    if (!options || typeof options !== 'object') {
        throw new Error('Need to add at least a container');
    }
    this.containerEl = qs(options.container);
    this.children = this.containerEl.children;
    this.gridItemMargin = options.margin || 10;
    this.gridItemWidth = options.width || 210;

    this._resizeBind();
};
var MiloGridProto = MiloGrid.prototype;

MiloGridProto._calcTopPosition = function(index) {
    return index >= this.gridColumns ? this.topOffset[index - this.gridColumns] : 0;
};

// to calculate the columns
// get the current available width
// then divide it by gridItem width + gridItem margin
// we are using Math.floor to get the most possible
// amount of columns to fit into the area allocated
MiloGridProto._calcGridColumns = function() {
    this.containerWidth = this.containerEl.clientWidth;
    this.gridColumns = Math.floor((this.containerWidth / (this.gridItemWidth + this.gridItemMargin)));
};

MiloGridProto.buildGrid = function() {
    var idx = 0;
    var length = this.children.length;
    // clean array before each build
    this.topOffset = [];

    this._calcGridColumns();

    for (idx; idx < length; idx++) {
        this.children[idx].style.cssText =
            'margin:' + this.gridItemMargin / 2 + ';' +
            'top:' + this._calcTopPosition(idx) + ';' +
            'left:' + (this.gridItemWidth + this.gridItemMargin) * Math.round(idx % this.gridColumns) + ';' +
            'width:' + this.gridItemWidth + ';';

        this.topOffset.push(this.children[idx].offsetHeight + this.gridItemMargin + this.children[idx].offsetTop);
    }
};

MiloGridProto._destroyGrid = function() {
    var idx = 0;
    var length = this.children.length;
    for (idx; idx < length; idx++) {
        this.children[idx].style.cssText = '';
    }
};

MiloGridProto._resizeBind = function() {
    var rebuildGrid = function() {
        this.buildGrid();
    }.bind(this);

    // debounce the window resize
    // to minimize the amount of rebuild calls
    window.addEventListener('resize', debounce(rebuildGrid, 600));
};

// expose a public api
var Milo = function(options) {
    var miloGrid = new MiloGrid(options);
    this.buildGrid = miloGrid.buildGrid.bind(miloGrid);
};

module.exports = Milo;
},{"./lib/debounce":1}]},{},[2]);
