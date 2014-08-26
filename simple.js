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