/* Copyright (c) 2010-2013 Richard Rodger */

"use strict";


var assert = require('chai').assert
var gex    = require('gex')
var _      = require('underscore')

var parambulator = require('..')



describe('default', function() {

  var pb

  it('happy', function() {
    pb = parambulator({
      a: {default$:123, type$:'number'},
      b: {
        firstobj: {default$:23, type$:'number'}, 
        secondobj: {innerobj: {default$:'test'}},
        thirdobj: {type$:'array', __0: {default$:123}},  
      },
      c: {default$:555, type$:'number'},
      d: {type$: 'array', __0: {default$:'arraytest0'}, __1: {default$:'arraytest1'}},
      e: {type$: 'array', default$:[]},

      // TODO: handle this case
      //f: {default$:'aa', type$:'number'}
    })
  })


  it('firsttest', function() {
    var obj = {c: 2222}
    pb.validate(obj)

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
  })


  it('nice', function() {
    parambulator({
      c: {default$:555, type$:'number'},
      d: {type$: 'number', __0: {default$:'arraytest0'}, __1: {default$:'arraytest1'}},
    })
  })



})


