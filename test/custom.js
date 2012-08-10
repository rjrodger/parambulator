
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
          equalsbar$: 'foo'
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
            equalsbar$:'Property %s is not equal to "bar", man... At %s.'
          }
        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },



    'equalsbar': function( pb ) {
      pb.validate({req:1,foo:'bar'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({req:1,foo:'foo'},function(err,res){
        //console.dir(err)
        //console.dir(res)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'equalsbar$')
      })

      pb.validate({req:1},function(err,res){
        //console.dir(err)
        //console.dir(res)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'equalsbar$')
      })

      pb.validate({},function(err,res){
        //console.dir(err)
        //console.dir(res)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'required$')
      })

    },




  }
}).export(module)

