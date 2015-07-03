var precompile = require('../')

var test = require('tape')

test('fs external view', function(t){
  var p = precompile(__filename)
  
  p.on('data', function(data){
    t.equal(data, 
      'var View = require("rincewind")\n'+
      'var render = View({"c": ["  ",{"c":[" <span>",{"c":["I am strong text"],"v":"strong"},"</span> "],"v":"header"}," <div>Content</div>"], "views": {"header": {"c": ["<h1>",{"vc":true},"</h1>"], "views": {}},"strong": require("./views/strong.js")}})\n'
    )
    t.end()
  })

  p.write('var View = require("rincewind")\n')
  p.write('var render = View(__dirname + "/views/index.html")\n')
  p.end()
})

test('fs package view', function(t){
  var p = precompile(__filename)
  
  p.on('data', function(data){
    t.equal(data, 
      'var View = require("rincewind")\n'+
      'var render = View({"c": ["   ",{"c":[" ",{"c":[" <span>",{"c":["I am strong text"],"v":"strong"},"</span> "],"v":"header"}," "],"v":"section"}], "views": {"header": {"c": ["<h1>",{"vc":true},"</h1>"], "views": {}},"strong": require("./node_modules/module-with-views/strong.js"),"section": {"c": [], "views": {}}}})\n'
    )
    t.end()
  })

  p.write('var View = require("rincewind")\n')
  p.write('var render = View("module-with-views/index.html")\n')
  p.end()
})
