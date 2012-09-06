
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
          i: {lt$: "2012-09-04T00:00:00.000Z"},
          j: {lte$: 2},
          k: {lte$: "2012-09-04T00:00:00.000Z"},
          l: {gt$: 2},
          m: {gt$: "2012-09-04T00:00:00.000Z"},
          n: {gte$: 2},
          o: {gte$: "2012-09-04T00:00:00.000Z"},
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
      pb.validate({h: 0},function(err,lt){
        assert.isNull(err)
      })

      pb.validate({h: 2}, function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'lt$')
      })
      
      pb.validate({i: "2012-09-03T00:00:00.000Z"}, function(err,res) {
        assert.isNull(err)
      })
      
      pb.validate({i: "2012-09-04T00:00:00.000Z"}, function(err,res) {
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'lt$')
      })
      
      pb.validate({i: "not a date"}, function(err,res) {
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'lt$')
      })      
    },


    'lte$': function( pb ) {
      pb.validate({j: 2},function(err,lt){
        assert.isNull(err)
      })

      pb.validate({j: 3}, function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'lte$')
      })
      
      pb.validate({k: "2012-09-04T00:00:00.000Z"}, function(err,res) {
        assert.isNull(err)
      })
      
      pb.validate({k: "2012-09-05T00:00:00.000Z"}, function(err,res) {
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'lte$')
      })
      
      pb.validate({k: "not a date"}, function(err,res) {
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
      
      pb.validate({m: "2012-09-05T00:00:00.000Z"}, function(err,res) {
        assert.isNull(err)
      })
      
      pb.validate({m: "2012-09-04T00:00:00.000Z"}, function(err,res) {
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'gt$')
      })
      
      pb.validate({m: "not a date"}, function(err,res) {
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'gt$')
      })      
    },


    'gte$': function( pb ) {
      pb.validate({n: 2},function(err,lt){
        assert.isNull(err)
      })

      pb.validate({n: 1}, function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'gte$')
      })
      
      pb.validate({o: "2012-09-04T00:00:00.000Z"},function(err,res) {
        assert.isNull(err)
      })
      
      pb.validate({o: "2012-09-03T00:00:00.000Z"},function(err,res) {
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'gte$')
      })
      
      pb.validate({o: "not a date"},function(err,res) {
        assert.isNotNull(err)
        assert.equal(err.parambulator.code, 'gte$')
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

