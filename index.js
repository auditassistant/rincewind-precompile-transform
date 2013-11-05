var callify = require('callify')
var View = require('rincewind')
var readFileSync = require('fs').readFileSync
var staticEval = require('static-eval')
var path = require('path')

module.exports = callify({
  rincewind: function(node, params){
    var r = params.requires
    var arg1 = node.arguments[0]
    var arg2 = node.arguments[1]

    var html = arg1.value
    var options = evalArg(arg2)

    // handle readFileSync
    if (isRFS(arg1, params)){
      html = readFileSync.apply(this, getStaticArgs(arg1, params))
    }

    var view = View(html, options)
    arg1.update(JSON.stringify(view.getView()) || 'undefined')
  },

  // require hooks
  'fs.readFileSync': true,
  'fs': true
})

function evalArg(node){
  if (node){
    if (node.type === 'Literal'){
      return node.value
    } else if (node.type === 'ObjectExpression'){
      var result = {}
      for (var i=0;i<node.properties.length;i++){
        var prop = node.properties[i]
        var propKey = prop.key.name || prop.key.value
        result[propKey] = prop.value.value
      }
      return result
    }
  }
}

function getCallMembers(node){
  if (node.type === 'MemberExpression' && node.property.type === 'Identifier'){
    return (getCallMembers(node.object) || []).concat(node.property.name)
  } else if (node.type === 'Identifier'){
    return [node.name]
  }
  return []
}

function getStaticArgs(node, params){
  return node.arguments.map(function(arg){
    return staticEval(arg, {
      __dirname: path.dirname(params.file), 
      __filename: params.file
    })
  })
}

function isRFS(node, params){
  if (node.type === 'CallExpression'){
    var calls = getCallMembers(node.callee)
    var match = params.requires[calls[0]]
    return match === 'fs.readFileSync' || (match === 'fs' && calls[1] === 'readFileSync')
  }
}