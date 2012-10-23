
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
              secondobj: {default$:'testing', type$:'string'},
              thirdobj: {innerobj: {default$:'test'},
              }
            },
          c: {default$:555, type$:'number'},
        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },

    'firsttest': function( pb ) {
      var obj = {c: 123}
      pb.validate(obj,function(err,res){
        assert.isNull(err)
      })

      assert.isTrue(_.has(obj, 'a'))
      assert.equal(obj['a'], 123)

      assert.isTrue(_.has(obj, 'b'))
      assert.isTrue(_.has(obj['b'], 'firstobj'))
      assert.equal(obj['b']['firstobj'], 23)

      assert.isTrue(_.has(obj['b'], 'secondobj'))
      assert.equal(obj['b']['secondobj'], 'testing')

      assert.isTrue(_.has(obj['b'], 'thirdobj'))
      assert.isTrue(_.has(obj['b']['thirdobj'], 'innerobj'))
      assert.equal(obj['b']['thirdobj']['innerobj'], 'test')

      assert.isTrue(_.has(obj, 'c'))
      assert.equal(obj['a'], 123)
    },
  }
}).export(module)

