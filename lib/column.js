 'use strict';

 var BloccColumn = function(id, grid) {
     this.id = id;
     this.children = [];
     this.height = 0;
     this.grid = grid;
 };
 var BloccColumnProto = BloccColumn.prototype;

 BloccColumnProto.addChild = function(child, position, childIndex) {
     var gridOptions = this.grid.options;
     this.children.push(child);

     if (position) {
         var cssPosition = {
             'left': this.id * (gridOptions.gridSize + gridOptions.gridGutter),
             'top': this.height,
             'display': 'block'
         };
         if (gridOptions.setChildPosition) {
             gridOptions.setChildPosition(child, cssPosition, childIndex);
         } else {
             for (var pos in cssPosition) {
                 if (cssPosition.hasOwnProperty(pos)) {
                     child.style[pos] = cssPosition[pos];
                 }
             }
         }
     }

     this.height = this.height + this.calculateElementHeight(child) + gridOptions.gridGutter;
 };

 BloccColumnProto.calculateElementHeight = function(child) {
     var gridOptions = this.grid.options;
     var columns = parseInt(child.getAttribute('data-grid-rows'), 10) || 1;
     return columns * gridOptions.gridSize + gridOptions.gridGutter * (columns - 1);
 };

 module.exports = BloccColumn;