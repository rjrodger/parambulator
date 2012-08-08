
var vows   = require('vows')
var assert = require('assert')
var gex    = require('gex')

var parambulator = require('../lib/parambulator.js')



vows.describe('basic').addBatch({
  'happy': {
    topic: function() {
      return new parambulator.Parambulator({
        rules: {
          exclusive: ['path','from']
        }
      })
    },

    'small': function( pb ) {

      pb.validate({path:1},function(err,res){
        assert.isNull(err)
        console.dir(res)
      })

      pb.validate({path:1,from:1},function(err,res){
        console.dir(err)
        console.dir(res)
      })

    },
  }
}).export(module)

