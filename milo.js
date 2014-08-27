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