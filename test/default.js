
var vows   = require('vows')
var assert = require('assert')
var gex    = require('gex')
var _ = require('underscore')

var parambulator = require('../lib/parambulator.js')



vows.describe('default').addBatch({
  'happy': {
    topic: function() {
      try {
        return new parambulator.Parambulator({
          a: {default$:123, type$:'number'},
          b: {
              firstobj: {default$:23, type$:'number'}, 
              secondobj: {innerobj: {default$:'test'}},
              thirdobj: {type$:'array', __0: {default$:123}},  
            },
          c: {default$:555, type$:'number'},
          d: {type$: 'array', __0: {default$:'arraytest0'}, __1: {default$:'arraytest1'}},
          e: {type$: 'array', default$:[]},
          f: {default$:'aa', type$:'number'}
        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },

    'firsttest': function( pb ) {
      var obj = {c: 2222}
      pb.validate(obj,function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })

      assert.isTrue(_.has(obj, 'a'))
      assert.equal(obj['a'], 123)

      assert.isTrue(_.has(obj, 'b'))
      assert.isTrue(_.has(obj['b'], 'firstobj'))
      assert.equal(obj['b']['firstobj'], 23)

      assert.isTrue(_.has(obj['b'], 'secondobj'))
      assert.isTrue(_.has(obj['b']['secondobj'], 'innerobj'))
      assert.equal(obj['b']['secondobj']['innerobj'], 'test')

      assert.isTrue(_.has(obj['b'], 'thirdobj'))
      assert.isTrue(_.isArray(obj['b']['thirdobj']))
      assert.equal(obj['b']['thirdobj'], '123')

      assert.isTrue(_.has(obj, 'c'))
      assert.equal(obj['c'], 2222)

      assert.isTrue(_.has(obj, 'd'))
      assert.isTrue(_.isArray(obj['d']))
      assert.equal('arraytest0', obj['d'][0])
      assert.equal('arraytest1', obj['d'][1])

      assert.isTrue(_.has(obj, 'e'))
      assert.isTrue(_.isArray(obj['e']))
      assert.equal(0, obj['e'].length)
    },
  },
  'nice': {
    topic: function() {
      try {
        return new parambulator.Parambulator({
          c: {default$:555, type$:'number'},
          d: {type$: 'number', __0: {default$:'arraytest0'}, __1: {default$:'arraytest1'}},
        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },

    'firsttest': function( pb ) {
      var obj = {c: 2222}
      pb.validate(obj,function(err,res){
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'default$')
      })
    },
  }
}).export(module)

