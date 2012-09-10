
var vows   = require('vows')
var assert = require('assert')
var gex    = require('gex')

var parambulator = require('../lib/parambulator.js')



vows.describe('type').addBatch({
  'happy': {
    topic: function() {
      try {
        return new parambulator.Parambulator({
          a: {type$:'string'},
          b: {type$:'number'},
          c: {type$:'integer'},
          d: {type$:'boolean'},
          e: {type$:'date'},
          f: {type$:'array'},
          g: {type$:'object'},
          h: {type$:['date','string','array']},
        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },

    'multi-types': function( pb ) {
      pb.validate({},function(err,res){
        assert.isNull(err)
      })

      pb.validate({h:'foo'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({h:1},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },



    'string': function( pb ) {
      pb.validate({},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:'foo'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:1},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },



    'number': function( pb ) {
      pb.validate({b:1.1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({b:'foo'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },


    'integer': function( pb ) {
      pb.validate({c:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({c:1.1},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },


    'boolean': function( pb ) {
      pb.validate({d:true},function(err,res){
        assert.isNull(err)
      })

      pb.validate({d:false},function(err,res){
        assert.isNull(err)
      })

      pb.validate({d:'foo'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },


    'date': function( pb ) {
      pb.validate({e:new Date()},function(err,res){
        assert.isNull(err)
      })

      pb.validate({e:'foo'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },


    'array': function( pb ) {
      pb.validate({f:[]},function(err,res){
        assert.isNull(err)
      })

      pb.validate({f:[11]},function(err,res){
        assert.isNull(err)
      })

      pb.validate({f:'foo'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },


    'object': function( pb ) {
      pb.validate({g:null},function(err,res){
        assert.isNull(err)
      })

      pb.validate({g:{}},function(err,res){
        assert.isNull(err)
      })

      pb.validate({g:{a:1}},function(err,res){
        assert.isNull(err)
      })

      pb.validate({g:[]},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },

  }
}).export(module)

