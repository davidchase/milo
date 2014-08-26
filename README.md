Milo
======

![Milo](images/milo.png)

A small pure javascript grid that provides as a nice fallback to browsers
that don't currently support column-count such as IE8, IE9

Simple usage:

Use [browserify](http://browserify.org) for client commonjs `require`

`npm install -g browserify`

```js
var Milo = require('./milo');

var milo = new Milo({
    container: '.grid'
});

window.addEventListener('load', milo.buildGrid);
```