
var vows   = require('vows')
var assert = require('assert')
var gex    = require('gex')

var parambulator = require('../lib/parambulator.js')



vows.describe('array').addBatch({
  'happy': {
    topic: function() {
      try {
        return new parambulator.Parambulator({
          atmostone$: 'a*',


          '*': {
            a:{type$:'integer'}
          }

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
      })

      pb.validate({c:1},function(err,res){
        assert.isNull(err)
      })


      pb.validate({a:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:1,ax:1},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'atmostone$')
      })

    },




    '*': function( pb ) {

      pb.validate({x:{a:1},y:{a:2}},function(err,res){
        assert.isNull(err)
      })

      pb.validate({x:{a:'b'}},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    }


  }
}).export(module)

