'use strict';
var Milo = require('../milo');

var milo = new Milo({
    container: '.grid'
});

window.addEventListener('load', milo.buildGrid);