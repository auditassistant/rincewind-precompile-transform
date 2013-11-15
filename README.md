rincewind-precompile-transform
===

Browserify transform to inline and precompile [rincewind](https://github.com/mmckegg/rincewind) templates.

Finds all rincewind calls in source and loads the view and any subviews and replaces with a parsed JSON precompiled version.

[![NPM](https://nodei.co/npm/rincewind-precompile-transform.png?compact=true)](https://nodei.co/npm/rincewind-precompile-transform/)

## Example

```js
// entry.js
var View = require('rincewind')

var master = View(__dirname + '/master.html')

var views = {
  'index': View(__dirname + '/index.html'),
  'page': View(__dirname + '/page.html')
}
```

```bash
$ browserify entry.js -t rincewind-precompile-transform > output.js
```

```js
// output.js
var View = require('rincewind')

var master = View({...compiled view...})

var views = {
  'index': View({...compiled view...}),
  'page': View({...compiled view...})
}
```