var callify = require('callify')
var View = require('rincewind')
var readFileSync = require('fs').readFileSync
var staticEval = require('static-eval')
var path = require('path')

module.exports = callify({
  rincewind: function(node, params){
    var r = params.requires
    var arg = getStaticArg(node.arguments[0], params)
    var dirname = path.dirname(params.file)

    if (typeof arg == 'string'){
      var view = View(arg)
      var newArg = dump(view.getCompiledView(), dirname)
      node.arguments[0].update(newArg)
    }

  }
})

function dump(view, dirname){
  if (view){
    if (view.require){
      return 'require(' + JSON.stringify('./' + path.relative(dirname, view.require)) + ')'
    } else {
      return '{' + Object.keys(view).filter(function(key){
        return key !== 'requires'
      }).map(function(key){
        if (key === 'views'){
          var views = view.views
          return '"views": {' + Object.keys(views).map(function(viewKey){
            return JSON.stringify(viewKey) + ': ' + dump(views[viewKey], dirname)
          }).join(',') + '}'
        } else {
          return JSON.stringify(key) + ': ' + JSON.stringify(view[key])
        }
      }).join(', ') + '}'
    }
  }
}

function getStaticArg(node, params){
  return staticEval(node, {
    __dirname: path.dirname(params.file), 
    __filename: params.file
  })
}