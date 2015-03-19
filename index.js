var callify = require('callify')
var View = require('rincewind')
var staticEval = require('static-eval')

var join = require('path').join
var getDirName = require('path').dirname
var getRelativePath = require('path').relative
var resolve = require('resolve')

module.exports = callify({
  rincewind: function(node, params){
    var r = params.requires
    var arg = getStaticArg(node.arguments[0], params)
    var dirname = getDirName(params.file)

    if (typeof arg == 'string'){

      if (isPackageRequire(arg)){
        arg = resolve.sync(arg, { basedir: dirname })
      }

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

  if (view.resources){
    Object.keys(view.resources).forEach(function(key){
      var resource = view.resources[key]
      if (resource instanceof Object){
        stream.emit('file', resource.path)
      }
    })
  }
}

function getStaticArg(node, params){
  return staticEval(node, {
    __dirname: getDirName(params.file), 
    __filename: params.file
  })
}


function isPackageRequire(file){
  return typeof file === 'string' && !!/^[^\.\/\\]/.exec(file)
}