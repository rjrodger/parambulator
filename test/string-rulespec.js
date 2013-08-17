/* Copyright (c) 2010-2013 Richard Rodger */

"use strict";


var assert = require('assert')

var parambulator = require('..')


describe('string-rulespec', function() {

  it('single', function() {
    var pm, res

    pm = parambulator({foo:'required$'})
    res = pm.validate({foo:'1'})
    assert.ok( null == res )

    res = pm.validate({bar:'1'})
    assert.ok( null != res )
    assert.equal('required$',res.parambulator.code)
    assert.ok(res.parambulator.point.bar)
  })


  it('multiple', function() {
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
  })

})
