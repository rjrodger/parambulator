/* Copyright (c) 2010-2013 Richard Rodger */

'use strict';

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var assert = require('assert')

var parambulator = require('..')


describe('string-rulespec', function() {

  it('single', function(done) {
    var pm, res

    pm = parambulator({foo:'required$'})
    res = pm.validate({foo:'1'})
    assert.ok( null == res )

    res = pm.validate({bar:'1'})
    assert.ok( null != res )
    assert.equal('required$',res.parambulator.code)
    assert.ok(res.parambulator.point.bar)
      done()
  })


  it('multiple', function(done) {
    var pm, res

    pm = parambulator({foo:'required$,integer$'})
    res = pm.validate({foo:1})
    assert.ok( null == res )

    res = pm.validate({bar:1})
    assert.ok( null != res )
    assert.equal('required$',res.parambulator.code)
    assert.ok(res.parambulator.point.bar)

    res = pm.validate({foo:'zoo'})
    assert.ok( null != res )
    //console.log(res)
    assert.equal('integer$',res.parambulator.code)
    assert.ok(res.parambulator.point.foo)
      done()
  })

})
