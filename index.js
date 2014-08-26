"use strict";
var defer = require('./lib/defer');
var each = require('./lib/each');
var BloccColumn = require('./lib/column');
var query = document.querySelector.bind(document);

var Bloccs = function(options) {
    this.options = {
        containerEl: query(options.container),
        children: query(options.container).children,
        gridSize: options.gridSize,
        gridGutter: options.gridGutter,
        setChildPosition: options.setChildPosition,
        setChildProperties: options.setChildProperties
    };

    if (this.options.children) {
        this.reflowContent();
    }

    if (options.onInitialized) {
        var self = this;
        defer(function() {
            options.onInitialized.apply(self);
        });
    }
};
var BloccsProto = Bloccs.prototype;
BloccsProto.reflowContent = function() {
    var containerHeight = 0;
    var height;
    this.createColumns();

    each(this.options.children, function(val, key) {
        this.positionChild(this.options.children[key], key);
    }.bind(this));

    each(this._columns, function(val, key) {
        height = this._columns[key].height;
        if (height > containerHeight) {
            containerHeight = height;
        }
    }.bind(this));

    this.options.containerEl.style.height = containerHeight;
};

BloccsProto.createColumns = function() {
    // Remove the applied width to the container so the calculation of the
    // width is based on the width the element can actually use.
    this.options.containerEl.style.width = 'auto';

    var containerWidth = this.options.containerEl.clientWidth;
    var columnCount = Math.floor(containerWidth / (this.options.gridSize + this.options.gridGutter));
    this.options.containerEl.style.width = columnCount * (this.options.gridSize + this.options.gridGutter) - this.options.gridGutter;

    this._columns = [];
    this._currentColumn = 0;
    for (var i = 0; i < columnCount; i++) {
        this._columns[i] = new BloccColumn(i, this);
    }
};

BloccsProto.positionChild = function(child, childIndex) {
    var columnMatches = [[]];
    var columnMatchesCursor = 0;
    var columnCount = this._columns.length;
    var currentColumnHeight = this._columns[this._currentColumn].height;
    var requiredColumns = parseInt(child.getAttribute('data-grid-columns'), 10) || 1;
    var i;
    for (i = this._currentColumn; i < (columnCount + this._currentColumn); i++) {
        var index = i % columnCount;

        // If we go from the last column to the first column, we empty the
        // current set of columns.
        if (index === 0) {
            columnMatches[columnMatchesCursor] = [];
        }

        // Columns sharing the same height should be added to the current
        // match.  If the number of columns in the match correspond to the
        // number of columns necessary to display the item, we create a new
        // set.
        if (this._columns[index].height === currentColumnHeight) {
            if (columnMatches[columnMatchesCursor].length < requiredColumns) {
                columnMatches[columnMatchesCursor].push(this._columns[index]);
            }

            if (columnMatches[columnMatchesCursor].length === requiredColumns) {
                columnMatchesCursor++;
                columnMatches[columnMatchesCursor] = [];
            }
        } else {
            columnMatches[columnMatchesCursor] = [this._columns[index]];
            currentColumnHeight = this._columns[index].height;
        }
    }

    // Find the best match in our set of columns. The best match will be the set
    // of columns that has the smallest height.
    var bestColumnMatch = columnMatches[0];
    for (i = 1; i < columnMatches.length; i++) {
        if (columnMatches[i].length !== requiredColumns) {
            continue;
        }

        if (columnMatches[i][0].height < bestColumnMatch[0].height) {
            bestColumnMatch = columnMatches[i];
        }
    }

    // If the required number of columns doesn't match - we early return. There are no
    // easy solution at the moment, and this issue only happens when an element has a
    // number of required columns too big.
    if (bestColumnMatch.length !== requiredColumns) {
        child.style.display = 'none';
        return;
    }

    // Add the element into the columns.
    for (var columnIndex = 0; columnIndex < bestColumnMatch.length; columnIndex++) {
        bestColumnMatch[columnIndex].addChild(child, columnIndex === 0, childIndex);
    }

    this.setChildProperties(child, childIndex);
    this.recalculateSmallestColumn();
};

BloccsProto.setChildProperties = function(child, childIndex) {
    var gridColumnAttr = 'grid-columns';
    var gridRowsAttr = 'grid-rows';

    var properties = {
        width: this.getDimensionFromSize(
            parseInt(child.getAttribute('data-' + gridColumnAttr)), 10) || 'auto',
        height: this.getDimensionFromSize(
            parseInt(child.getAttribute('data-' + gridRowsAttr)), 10) || 'auto'
    };
    if (this.options.setChildProperties) {
        this.options.setChildProperties(child, properties, childIndex);
    } else {
        for (var prop in properties) {
            if (properties.hasOwnProperty(prop)) {
                child.style[prop] = properties[prop];
            }
        }
    }
};

BloccsProto.getDimensionFromSize = function(size) {
    return size * this.options.gridSize + (size - 1) * this.options.gridGutter;
};

BloccsProto.recalculateSmallestColumn = function() {
    this._currentColumn = 0;

    var columnCount = this._columns.length;
    var smallestColumn = this._columns[this._currentColumn];

    for (var id = 1; id < columnCount; id++) {
        if (this._columns[id].height < this._columns[this._currentColumn].height) {
            this._currentColumn = id;
        }
    }
};

module.exports = Bloccs;