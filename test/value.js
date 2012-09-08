
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
          h: {lt$: 2},
          i: {lt$: new Date("2012-09-04")},
          j: {lte$: 2},
          k: {lte$: new Date("2012-09-04")},
          l: {gt$: 2},
          m: {gt$: new Date("2012-09-04")},
          n: {gte$: 2},
          o: {gte$: new Date("2012-09-04")},
          p: {min$: 2},
          q: {min$: new Date("2012-09-04")},
          r: {max$: 2},
          s: {max$: new Date("2012-09-04")},
          
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


    'lt$': function( pb ) {
      pb.validate({h: 1},function(err,lt){
        assert.isNull(err)
      })

      pb.validate({h: 3}, function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'lt$')
      })
      
      pb.validate({i: new Date("2012-09-03")}, function(err,res) {
        assert.isNull(err)
      })
      
      pb.validate({i: new Date("2012-09-04")}, function(err,res) {
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'lt$')
      })
    },


    'lte$': function( pb ) {
      pb.validate({j: 1},function(err,lt){
        assert.isNull(err)
      })

      pb.validate({j: 2},function(err,lt){
        assert.isNull(err)
      })

      pb.validate({j: 3}, function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'lte$')
      })
      
      pb.validate({k: new Date("2012-09-04")}, function(err,res) {
        assert.isNull(err)
      })
      
      pb.validate({k: new Date("2012-09-05")}, function(err,res) {
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'lte$')
      })
    },


    'gt$': function( pb ) {
      pb.validate({l: 3},function(err,lt){
        assert.isNull(err)
      })

      pb.validate({l: 2}, function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'gt$')
      })
      
      pb.validate({m: new Date("2012-09-05")}, function(err,res) {
        assert.isNull(err)
      })
      
      pb.validate({m: new Date("2012-09-04")}, function(err,res) {
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'gt$')
      })
    },


    'gte$': function( pb ) {
      pb.validate({n: 2},function(err,lt){
        assert.isNull(err)
      })

      pb.validate({n: 3},function(err,lt){
        assert.isNull(err)
      })

      pb.validate({n: 1}, function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'gte$')
      })
      
      pb.validate({o: new Date("2012-09-04")},function(err,res) {
        assert.isNull(err)
      })
      
      pb.validate({o: new Date("2012-09-03")},function(err,res) {
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'gte$')
      })      
    },


    'min$': function( pb ) {
      pb.validate({p: 2},function(err,lt){
        assert.isNull(err)
      })

      pb.validate({p: 3},function(err,lt){
        assert.isNull(err)
      })

      pb.validate({p: 1}, function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'min$')
      })
      
      pb.validate({q: new Date("2012-09-04")},function(err,res) {
        assert.isNull(err)
      })
      
      pb.validate({q: new Date("2012-09-03")},function(err,res) {
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'min$')
      })      
    },


    'max$': function( pb ) {
      pb.validate({j: 1},function(err,lt){
        assert.isNull(err)
      })

      pb.validate({j: 2},function(err,lt){
        assert.isNull(err)
      })

      pb.validate({j: 3}, function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'lte$')
      })
      
      pb.validate({k: new Date("2012-09-04")}, function(err,res) {
        assert.isNull(err)
      })
      
      pb.validate({k: new Date("2012-09-05")}, function(err,res) {
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'lte$')
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

