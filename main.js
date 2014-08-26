'use strict';
var Bloccs = require('./index');
var debounce = require('./lib/debounce');

var blocs = new Bloccs({
    container: '.grid',
    gridSize: 250,
    gridGutter: 13
});

var resizeWindow = function() {
    blocs.reflowContent();
};

window.addEventListener('resize', debounce(resizeWindow, 500));