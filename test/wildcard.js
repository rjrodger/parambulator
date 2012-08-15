
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
          },

          'z*': 'required$'

        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },


    'a*': function( pb ) {
      pb.validate({z:1,},function(err,res){
        assert.isNull(err)
      })

      pb.validate({z:1,c:1},function(err,res){
        assert.isNull(err)
      })


      pb.validate({z:1,a:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({z:1,a:1,ax:1},function(err,res){
        //console.log(err)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'atmostone$')
      })
    },


    '*': function( pb ) {

      pb.validate({z:1,x:{a:1},y:{a:2}},function(err,res){
        assert.isNull(err)
      })


      pb.validate({z:1,x:{a:'b'}},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })


      pb.validate({z:1,x:[{a:1},{a:2}]},function(err,res){
        assert.isNull(err)
      })

      pb.validate({z:1,y:[{a:1},{a:2}]},function(err,res){
        assert.isNull(err)
      })


      pb.validate({z:1,y:[{a:'b'}]},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },


    '**': function( pb ) {

      pb.validate({z:1,b:1,x:{a:1,b:1,y:{b:1}}},function(err,res){
        assert.isNull(err)
      })

      pb.validate({z:1,b:'foo'},function(err,res){
        //console.log(err)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })


      pb.validate({z:1,x:{b:'foo'}},function(err,res){
        //console.log(err)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })

      pb.validate({z:1,x:{y:{b:'foo'}}},function(err,res){
        //console.log(err)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },


    'z*': function( pb ) {
      pb.validate({z:1},function(err,res){
        assert.isNull(err)
      })


      pb.validate({za:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({},function(err,res){
        //console.log(err)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'required$')
      })
    },


  }
}).export(module)

