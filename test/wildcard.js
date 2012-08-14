
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
          },

          y: {
            '*': {
              a:{type$:'integer'}
            },
          },

          '**': {
            b:{type$:'integer'}
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
        //console.log(err)
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


      pb.validate({x:[{a:1},{a:2}]},function(err,res){
        assert.isNull(err)
      })

      pb.validate({y:[{a:1},{a:2}]},function(err,res){
        assert.isNull(err)
      })


      pb.validate({y:[{a:'b'}]},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },


    '**': function( pb ) {

      pb.validate({b:1,x:{a:1,b:1,y:{b:1}}},function(err,res){
        assert.isNull(err)
      })

      pb.validate({b:'foo'},function(err,res){
        //console.log(err)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })


      pb.validate({x:{b:'foo'}},function(err,res){
        //console.log(err)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })

      pb.validate({x:{y:{b:'foo'}}},function(err,res){
        //console.log(err)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    }

  }
}).export(module)

