
var vows   = require('vows')
var assert = require('assert')
var gex    = require('gex')
var parambulator = require('../lib/parambulator.js')



vows.describe('format').addBatch({
  'happy': {
    topic: function() {
      try {
        return new parambulator.Parambulator({
          a: {format$:'datetime'},
          b: {format$:'date'},
          c: {format$:'time'},
          d: {format$:'utcmillisec'},
          e: {format$:'re'},
          f: {format$:['date', 'time']},
        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },

    'datetime': function( pb ) {
      pb.validate({},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:'2012-02-02T11:12:13Z'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:'2012-02-02'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'format$')
      })
    },

    'date': function( pb ) {
      pb.validate({},function(err,res){
        assert.isNull(err)
      })

      pb.validate({b:'2012-02-02'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({b:'2012-32-02'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'format$')
      })
    },

    'time': function( pb ) {
      pb.validate({},function(err,res){
        assert.isNull(err)
      })

      pb.validate({c:'11:12:13Z'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({c:'51:12:13Z'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'format$')
      })
    },

    'utcmillisec': function( pb ) {
      pb.validate({},function(err,res){
        assert.isNull(err)
      })

      pb.validate({d:124578},function(err,res){
        assert.isNull(err)
      })

      pb.validate({d:'test'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'format$')
      })
    },
    
    're': function( pb ) {
      pb.validate({},function(err,res){
        assert.isNull(err)
      })

      pb.validate({e:/([0-1]\d|2[0-4]):[0-5]\d:[0-5]\dZ/},function(err,res){
        assert.isNull(err)
      })

      pb.validate({e:124578},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'format$')
      })
    },
    

    'date-time': function( pb ) {
      pb.validate({},function(err,res){
        assert.isNull(err)
      })

      pb.validate({f:'2012-02-02'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({f:'2012-32-02'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'format$')
      })

      pb.validate({f:'11:12:13Z'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({f:'51:12:13Z'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'format$')
      })

      pb.validate({f:124578},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'format$')
      })

      pb.validate({f:/([0-1]\d|2[0-4]):[0-5]\d:[0-5]\dZ/},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'format$')
      })

      pb.validate({f:124578},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'format$')
      })

      pb.validate({f:'test'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'format$')
      })
    },
    
  }
}).export(module)

