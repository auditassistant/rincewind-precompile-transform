var precompile = require('../')

var test = require('tape')

test('Inline view with master', function(t){
  var p = precompile(__filename)

  p.on('data', function(data){
    t.equal(data.toString(), 
      'var View = require("rincewind")\n' +
      'var master = View({"master":{"ref":"master","elements":[["div",{},["Master"]]],"sub":[],"subBindings":[],"subViews":[],"bindings":[],"_isView":true},"$referencedViews":[],"$root":"master"}, "master")\n' +
      'var render = View({"view":{"ref":"view","elements":[["div",{},["Test"]]],"sub":[],"subBindings":[],"subViews":[],"bindings":[],"_isView":true},"$referencedViews":[],"$root":"view"}, {name: "view", master: master})\n'
    )
    t.end()
  })

  p.write('var View = require("rincewind")\n')
  p.write('var master = View("<div>Master</div>", "master")\n')
  p.write('var render = View("<div>Test</div>", {name: "view", master: master})\n')
  p.end()
})

test('fs external view', function(t){
  var p = precompile(__filename)
  
  p.on('data', function(data){
    t.equal(data.toString(), 
      'var fs = require("fs")\n'+
      'var View = require("rincewind")\n'+
      'var render = View({"view":{"ref":"view","elements":[["div",{},["external view"]]],"sub":[],"subBindings":[],"subViews":[],"bindings":[],"_isView":true},"$referencedViews":[],"$root":"view"}, {name: "view"})\n'
    )
    t.end()
  })

  p.write('var fs = require("fs")\n')
  p.write('var View = require("rincewind")\n')
  p.write('var render = View(fs.readFileSync(__dirname + "/view.html", "utf8"), {name: "view"})\n')
  p.end()
})

test('sub fs.readFileSync external view', function(t){
  var p = precompile(__filename)
  
  p.on('data', function(data){
    t.equal(data.toString(), 
      'var read = require("fs").readFileSync\n'+
      'var View = require("rincewind")\n'+
      'var render = View({"view":{"ref":"view","elements":[["div",{},["external view"]]],"sub":[],"subBindings":[],"subViews":[],"bindings":[],"_isView":true},"$referencedViews":[],"$root":"view"}, {name: "view"})\n'
    )
    t.end()
  })

  p.write('var read = require("fs").readFileSync\n')
  p.write('var View = require("rincewind")\n')
  p.write('var render = View(read(__dirname + "/view.html", "utf8"), {name: "view"})\n')
  p.end()
})
