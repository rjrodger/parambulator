
var vows   = require('vows')
var assert = require('assert')
var gex    = require('gex')

var parambulator = require('../lib/parambulator.js')



vows.describe('array').addBatch({
  'happy': {
    topic: function() {
      try {
        return new parambulator.Parambulator({
          z: 'required$',
          foo: {

            '__1': {
              bar: 'required$'
            },

            '__0': 'required$',
          },
        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },


    'z': function( pb ) {
      pb.validate({z:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'required$')
      })
    },


    'index0': function( pb ) {
      pb.validate({z:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({z:1,foo:[10]},function(err,res){
        assert.isNull(err)
      })

      pb.validate({z:1,foo:[]},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'required$')
      })


    },


    'index1': function( pb ) {

      pb.validate({z:1,foo:[10]},function(err,res){
        assert.isNull(err)
      })

      pb.validate({z:1,foo:[{},{bar:1}]},function(err,res){
        assert.isNull(err)
      })

      pb.validate({z:1,foo:[{},{}]},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'required$')
      })

      pb.validate({z:1,foo:[{},{barx:1}]},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'required$')
      })
    },


  }
}).export(module)

