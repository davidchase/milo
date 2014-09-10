Milo
======

![Milo](images/milo.png)

A small pure javascript grid that provides as a nice fallback to browsers
that don't currently support column-count such as IE8, IE9

Simple usage:
-------------

Check out the [**demo**](https://rawgit.com/davidchase/milo/freepeoples/example/index.html)

Use [browserify](http://browserify.org) for client commonjs `require`

`npm install -g browserify`

```js
var Milo = require('./milo');

var milo = new Milo({
    container: '.grid'
});

window.addEventListener('load', milo.buildGrid);
```

HTML can be formatted like so:

```html
<div class="grid">
    <div class="grid-item">...</div>
    <div class="grid-item">...</div>
    <div class="grid-item">...</div>
    <div class="grid-item">...</div>
    ...
</div>
```