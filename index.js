var callify = require('callify')
var View = require('rincewind')
var staticEval = require('static-eval')

var join = require('path').join
var getDirName = require('path').dirname
var getRelativePath = require('path').relative

module.exports = callify({
  rincewind: function(node, params){
    var r = params.requires
    var arg = getStaticArg(node.arguments[0], params)
    var dirname = getDirName(params.file)

    if (typeof arg == 'string'){
      var view = View(arg, {cache: false})
      params.stream.emit('file', arg)
      emitWatchPaths(params.stream, view.getCompiledView(), dirname)
      var newArg = view.stringify(dirname)
      node.arguments[0].update(newArg)
    }
  }
})

function emitWatchPaths(stream, view, root){
  if (view.requires){
    Object.keys(view.requires).forEach(function(key){
      var path = join(root, view.requires[key])
      stream.emit('file', path)
      if (view.views && view.views[key]){
        emitWatchPaths(stream, view.views[key], getDirName(path))
      }
    })
  } else if (view.require){
    stream.emit('file', view.require)
  }
}

function getStaticArg(node, params){
  return staticEval(node, {
    __dirname: getDirName(params.file), 
    __filename: params.file
  })
}