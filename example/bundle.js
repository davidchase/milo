(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var Milo = require('../milo');

var milo = new Milo({
    container: '.grid'
});

window.addEventListener('load', milo.buildGrid);
},{"../milo":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
'use strict';

var qs = document.querySelector.bind(document);
var debounce = require('./lib/debounce');
var MiloGrid = function(options) {
    if (!options || typeof options !== 'object') {
        throw new Error('Need to add at least a container');
    }
    this.containerEl = qs(options.container);
    this.children = this.containerEl.children;
    this.margin = options.margin || 10;
    this.width = options.width || 210;

    this._resizeBind();
};
var MiloGridProto = MiloGrid.prototype;

MiloGridProto._calcTopPosition = function(index) {
    return index >= this.containerGrids ? this.topOffset[index - this.containerGrids] : 0;
};

MiloGridProto.buildGrid = function() {
    var idx = 0;
    var length = this.children.length;
    // clean array before each build
    this.topOffset = [];

    this.containerWidth = this.containerEl.clientWidth;
    this.containerSpace = (this.containerWidth % (this.width + this.margin));
    this.containerGrids = (this.containerWidth - this.containerSpace) / (this.width + this.margin);

    for (idx; idx < length; idx++) {
        this.children[idx].style.cssText =
            'margin:' + this.margin / 2 + ';' +
            'top:' + this._calcTopPosition(idx) + ';' +
            'left:' + (this.width + this.margin) * Math.round(idx % this.containerGrids) + ';' +
            'width:' + this.width + ';';

        this.topOffset.push(this.children[idx].offsetHeight + this.margin + this.children[idx].offsetTop);
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


var Milo = function(options) {
    var miloGrid = new MiloGrid(options);
    this.buildGrid = miloGrid.buildGrid.bind(miloGrid);
};

module.exports = Milo;
},{"./lib/debounce":2}]},{},[1])