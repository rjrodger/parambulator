/* Copyright (c) 2010-2013 Richard Rodger */

"use strict";


var assert = require('chai').assert
var gex    = require('gex')

var parambulator = require('..')



describe('custom', function() {

  var pb

  it('happy', function() {
    pb = parambulator({
      required$: 'req',
      equalsbar$: 'foo',
      exactlyone$: ['a','b']
    }, {
      rules: {
        equalsbar$: function(ctxt,cb) {
          var pn = ctxt.rule.spec
          var val = ctxt.point[pn]
          if( 'bar' == val ) {
            return cb(null)
          }
          else {
            return ctxt.util.fail(ctxt,cb)
          }
        }
      },
      msgs: {
        required$:'Property %s is required, yo! At %s.',
        equalsbar$:'Property %s is not equal to "bar", man... At %s.',
        exactlyone$: function(inserts) {
          return 'my custom error msg for '+inserts.rule.spec+' at location '+inserts.parentpath
        }
      }
    })
  })


  it('equalsbar', function() {
    pb.validate({req:1,a:1,foo:'bar'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({req:1,a:1,foo:'foo'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'equalsbar$')
    })

    pb.validate({req:1,a:1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'equalsbar$')
    })

    pb.validate({a:1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'required$')
    })

    pb.validate({req:1,foo:'bar', a:1,b:1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'exactlyone$')
      assert.equal(err.message,'my custom error msg for a,b at location top level')
    })
  })
})

