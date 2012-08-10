
var vows   = require('vows')
var assert = require('assert')
var gex    = require('gex')

var parambulator = require('../lib/parambulator.js')



vows.describe('array').addBatch({
  'happy': {
    topic: function() {
      try {
        return new parambulator.Parambulator({
          foo: {
            '__1': {
              bar: 'required$'
            },

            '__0': 'required$'
          }
        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },



    'index0': function( pb ) {

      pb.validate({},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })

      pb.validate({foo:[10]},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })

      pb.validate({foo:[]},function(err,res){
        assert.isNull(err)
        assert.isNotNull(res.failure)
        assert.equal(res.failure.parambulator.code,'required$')
      })


    },


    'index1': function( pb ) {

      pb.validate({foo:[10]},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })

      pb.validate({foo:[{},{bar:1}]},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })


      pb.validate({foo:[{},{}]},function(err,res){
        assert.isNull(err)
        assert.isNotNull(res.failure)
        assert.equal(res.failure.parambulator.code,'required$')
      })

      pb.validate({foo:[{},{barx:1}]},function(err,res){
        assert.isNull(err)
        assert.isNotNull(res.failure)
        assert.equal(res.failure.parambulator.code,'required$')
      })

    },




  }
}).export(module)

