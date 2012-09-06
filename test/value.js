
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
          g: {enum$:['A','B','C']},
          h: {minlen$:2},
          i: {maxlen$:6},

          wild$:'top*', // does nothing
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
      })

      pb.validate({a:'a'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({b:'bx'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({c:'xc'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:'b'},function(err,res){
        //console.log(err)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'wild$')
      })

    },


    'eq$': function( pb ) {
      pb.validate({d:'d*'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({d:'dx'},function(err,res){
        //console.log(err)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'eq$')
      })
    },

    'minlen$': function( pb ) {
      // test for string values
      pb.validate({h:'abcde'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({h:'a'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'minlen$')
      })

      // test arrays
      pb.validate({h:[1,2,3,4]},function(err,res){
        assert.isNull(err)
      })

      pb.validate({h:[1]},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'minlen$')
      })


      // test objects
      pb.validate({h:{1:1, 2:2, 3:3, 4:4}},function(err,res){
        assert.isNull(err)
      })

      pb.validate({h:{1:1}},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'minlen$')
      })
    },

    'maxlen$': function( pb ) {
	  // test string values
      pb.validate({i:'abcde'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({i:'abcdefgh'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'maxlen$')
      })

      // test arrays
      pb.validate({i:[1,2,3,4,5]},function(err,res){
        assert.isNull(err)
      })

      pb.validate({i:[1,2,3,4,5,6,7]},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'maxlen$')
      })

      // test objects
      pb.validate({i:{1:1, 2:2, 3:3, 4:4, 5:5}},function(err,res){
        assert.isNull(err)
      })

      pb.validate({i:{1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7}},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'maxlen$')
      })

    },


    're$': function( pb ) {
      pb.validate({e:'ez'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({e:'ex'},function(err,res){
        //console.log(err)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'re$')
      })

      pb.validate({f:'FZ'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({f:'fx'},function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'re$')
      })
    },


    'enum$': function( pb ) {
      pb.validate({g:'A'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({g:'X'},function(err,res){
        //console.log(err)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'enum$')
      })
    },

  },

  'toplevel': {
    topic: function() {
      try {
        return new parambulator.Parambulator({
          type$:'object'
        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },


    'toplevel': function( pb ) {

      pb.validate({},function(err){
        assert.isNull(err)
      })

      pb.validate("foo",function(err){
        assert.isNotNull(err)
      })

    }
  }



}).export(module)

