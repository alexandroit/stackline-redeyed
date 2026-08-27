'use strict'

var test = require('tape')
var path = require('path')
var fs = require('fs')
var redeyed = require('..')
var nodeModules = path.join(__dirname, '..', 'node_modules')
var esprimaDir = path.join(nodeModules, 'esprima')

function javascriptFiles (root, excludedDirectories) {
  var files = []

  function visit (directory) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
      var fullPath = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        if (excludedDirectories.indexOf(entry.name) === -1) visit(fullPath)
      } else if (entry.isFile() && path.extname(entry.name) === '.js') {
        files.push({
          fullPath: fullPath,
          path: path.relative(root, fullPath)
        })
      }
    })
  }

  visit(root)
  return files
}

test('esprima', function (t) {
  javascriptFiles(esprimaDir, []).forEach(function (entry) {
    var code = fs.readFileSync(entry.fullPath, 'utf8')
    var resultAst = redeyed(code, { Keyword: { var: '+:-' } }, { buildAst: true }).code
    var resultTokenize = redeyed(code, { Keyword: { var: '+:-' } }, { buildAst: false }).code

    t.assert(~resultAst.indexOf('+var-') || !(~resultAst.indexOf('var ')), 'redeyed ' + entry.path)
    t.assert(~resultTokenize.indexOf('+var-') || !(~resultTokenize.indexOf('var ')), 'redeyed ' + entry.path)
  })
  t.end()
})

test('redeyed', function (t) {
  javascriptFiles(path.join(__dirname, '..'), ['.git', 'dist', 'node_modules']).forEach(function (entry) {
    var code = fs.readFileSync(entry.fullPath, 'utf8')
    var result = redeyed(code, { Keyword: { var: '+:-' } }).code

    t.assert(~result.indexOf('+var-') || !(~result.indexOf('var ')), 'redeyed ' + entry.path)
  })
  t.end()
})
