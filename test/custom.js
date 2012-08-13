
var vows   = require('vows')
var assert = require('assert')
var gex    = require('gex')

var parambulator = require('../lib/parambulator.js')



vows.describe('custom').addBatch({
  'happy': {
    topic: function() {
      try {
        return new parambulator.Parambulator({
          required$: 'req',
          equalsbar$: 'foo',
          exactlyone$: ['a','b']
        }, {
          rules: {
            equalsbar$: function(ctxt,cb) {
              var pn = ctxt.rulespec
              var val = ctxt.point[pn]
              if( 'bar' == val ) {
                return cb(null,ctxt)
              }
              else {
                ctxt.util.fail(ctxt,cb)
              }
            }
          },
          msgs: {
            required$:'Property %s is required, yo! At %s.',
            equalsbar$:'Property %s is not equal to "bar", man... At %s.',
            exactlyone$: function() {
              return 'my custom error msg for values '+arguments[0]+' at location '+arguments[1]
            }
          }
        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },



    'equalsbar': function( pb ) {
      pb.validate({req:1,a:1,foo:'bar'},function(err,res){
        assert.isNull(err)
        assert.isUndefined(res.failure)
      })

      pb.validate({req:1,a:1,foo:'foo'},function(err,res){
        assert.isNull(err)
        assert.isNotNull(res.failure)
        assert.equal(res.failure.parambulator.code,'equalsbar$')
      })

      pb.validate({req:1,a:1},function(err,res){
        assert.isNull(err)
        assert.isNotNull(res.failure)
        assert.equal(res.failure.parambulator.code,'equalsbar$')
      })

      pb.validate({a:1},function(err,res){
        assert.isNull(err)
        assert.isNotNull(res.failure)
        assert.equal(res.failure.parambulator.code,'required$')
      })

      pb.validate({req:1,foo:'bar', a:1,b:1},function(err,res){
        assert.isNull(err)
        assert.isNotNull(res.failure)
        assert.equal(res.failure.parambulator.code,'exactlyone$')
        assert.equal(res.failure.message,'my custom error msg for values a,b at location top level')
      })

    },
  }
}).export(module)

