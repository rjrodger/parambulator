
var vows   = require('vows')
var assert = require('assert')
var gex    = require('gex')

var parambulator = require('../lib/parambulator.js')



vows.describe('value').addBatch({
  'happy': {
    topic: function() {
      try {
        return new parambulator.Parambulator({
          a: 'a',
          b: 'b*',
          c: {wild$:'*c'},

          d: {eq$:'d*'},

          e: {re$:'e[z]'},

          f: {re$:'/f[z]/i'},
        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },



    'wild$': function( pb ) {
      pb.validate({},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })

      pb.validate({a:'a'},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })

      pb.validate({b:'bx'},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })

      pb.validate({c:'xc'},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })

      pb.validate({a:'b'},function(err,res){
        assert.isNull(err)
        assert.isNotNull(res.failure)
        assert.equal(res.failure.parambulator.code,'wild$')
      })
    },


    'eq$': function( pb ) {
      pb.validate({d:'d*'},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })

      pb.validate({d:'dx'},function(err,res){
        assert.isNull(err)
        assert.isNotNull(res.failure)
        assert.equal(res.failure.parambulator.code,'eq$')
      })
    },


    're$': function( pb ) {
      pb.validate({e:'ez'},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })

      pb.validate({e:'ex'},function(err,res){
        assert.isNull(err)
        assert.isNotNull(res.failure)
        assert.equal(res.failure.parambulator.code,'re$')
      })

      pb.validate({f:'FZ'},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })

      pb.validate({f:'fx'},function(err,res){
        assert.isNull(err)
        assert.isNotNull(res.failure)
        assert.equal(res.failure.parambulator.code,'re$')
      })
    },


  }
}).export(module)

