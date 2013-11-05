rincewind-precompile-transform
===

Browserify transform to inline and precompile [rincewind](https://github.com/mmckegg/rincewind) templates.

Finds all rincewind calls in source and replaces with parsed JSON precompiled version. If a call contains a reference to `fs.readFileSync`, the file is loaded first.

[![NPM](https://nodei.co/npm/rincewind-precompile-transform.png?compact=true)](https://nodei.co/npm/rincewind-precompile-transform/)

## Example

```js
// entry.js
var View = require('rincewind')
var read = require('fs').readFileSync

var master = View(read(__dirname + '/master.html', 'utf8'), 'master')

var views = {
  'index': View(read(__dirname + '/index.html', 'utf8'), {master: master}),
  'page': View(read(__dirname + '/page.html', 'utf8'), {master: master})
}
```

```bash
$ browserify entry.js -t rincewind-precompile-transform > output.js
```

```js
// output.js
var View = require('rincewind')

var master = View({...compiled view...}, 'master')

var views = {
  'index': View({...compiled view...}, {master: master}),
  'page': View({...compiled view...}, {master: master})
}
```