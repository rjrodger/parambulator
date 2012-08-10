
var vows   = require('vows')
var assert = require('assert')
var gex    = require('gex')

var parambulator = require('../lib/parambulator.js')



vows.describe('array').addBatch({
  'happy': {
    topic: function() {
      try {
        return new parambulator.Parambulator({
          atmostone$: 'a*'
        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },



    'a*': function( pb ) {
      pb.validate({},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })

      pb.validate({c:1},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })


      pb.validate({a:1},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })

      pb.validate({a:1,ax:1},function(err,res){
        assert.isNull(err)
        assert.isNotNull(res.failure)
        assert.equal(res.failure.parambulator.code,'atmostone$')
      })

    },



  }
}).export(module)

