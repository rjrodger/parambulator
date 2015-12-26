/* Copyright (c) 2014-2015 Richard Rodger, MIT License */
'use strict';

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var parambulator = require('..')

var _ = require('lodash')
var assert = require('chai').assert

function s(obj){
  return JSON.stringify(obj)
}


describe('parambulator-multi', function() {

  var pb_default = parambulator({
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
  }, {multiErrors: true})


  it('default-firsttest', function(done) {
    var obj = {c: 2222}
    pb_default.validate(obj)

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
    assert.equal(obj['b']['thirdobj'][0], 123)

    assert.isTrue(_.has(obj, 'c'))
    assert.equal(obj['c'], 2222)

    assert.isTrue(_.has(obj, 'd'))
    assert.isTrue(_.isArray(obj['d']))
    assert.equal('arraytest0', obj['d'][0])
    assert.equal('arraytest1', obj['d'][1])

    assert.isTrue(_.has(obj, 'e'))
    assert.isTrue(_.isArray(obj['e']))
    assert.equal(0, obj['e'].length)
      done()
  })


  var pb_format= parambulator({
    a: {format$:'datetime'},
    b: {format$:'date'},
    c: {format$:'time'},
    d: {format$:'utcmillisec'},
    e: {format$:'re'},
    f: {format$:['date', 'time']},
  }, {
    multiErrors: true
  })


  it('format-datetime', function(done) {
    var validationsCount = 0

    pb_format.validate({},function(err,res){
      assert.isNull(err)
      validationsCount++
    })

    pb_format.validate({a:'2012-02-02T11:12:13Z'},function(err,res){
      assert.isNull(err)
      validationsCount++
    })

    pb_format.validate({a:'2012-02-02'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.length, 1)
      assert.equal(err[0].parambulator.code,'format$')
      validationsCount++
    })

    // if there is a bug in parambulator where the callback is never called
    // tests will succeed without going through the asserts
    assert.equal(validationsCount, 3)
      done()
  })

  it('format-date', function(done) {
    pb_format.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({b:'2012-02-02'},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({b:'2012-32-02'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.length, 1)
      assert.equal(err[0].parambulator.code,'format$')
    })
      done()
  })

  it('format-time', function(done) {
    pb_format.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({c:'11:12:13Z'},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({c:'51:12:13Z'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.length, 1)
      assert.equal(err[0].parambulator.code,'format$')
    })
      done()
  })

  it('format-utcmillisec', function(done) {
    pb_format.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({d:124578},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({d:'test'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.length, 1)
      assert.equal(err[0].parambulator.code,'format$')
    })
      done()
  })

  it('format-re', function(done) {
    pb_format.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({e:/([0-1]\d|2[0-4]):[0-5]\d:[0-5]\dZ/},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({e:124578},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.length, 1)
      assert.equal(err[0].parambulator.code,'format$')
    })
      done()
  })


  it('format-date-time', function(done) {
    pb_format.validate({},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({f:'2012-02-02'},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({f:'2012-32-02'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.length, 1)
      assert.equal(err[0].parambulator.code,'format$')
    })

    pb_format.validate({f:'11:12:13Z'},function(err,res){
      assert.isNull(err)
    })

    pb_format.validate({f:'51:12:13Z'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.length, 1)
      assert.equal(err[0].parambulator.code,'format$')
    })

    pb_format.validate({f:124578},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.length, 1)
      assert.equal(err[0].parambulator.code,'format$')
    })

    pb_format.validate({f:/([0-1]\d|2[0-4]):[0-5]\d:[0-5]\dZ/},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.length, 1)
      assert.equal(err[0].parambulator.code,'format$')
    })

    pb_format.validate({f:124578},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.length, 1)
      assert.equal(err[0].parambulator.code,'format$')
    })

    pb_format.validate({f:'test'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.length, 1)
      assert.equal(err[0].parambulator.code,'format$')
    })
      done()
  })

  it('format-all', function(done) {
    var ent = {
      a:'2012-02-02',
      b:'2012-32-02',
      c:'51:12:13Z',
      d:'test',
      e:124578,
      f:'51:12:13Z'
    }
    pb_format.validate(ent,function(err,res) {
      assert.isNotNull(err)
      assert.equal(err.length, 6)
      var i = 0
      _.each(ent, function(val, prop) {
	assert.equal(err[i].parambulator.property, prop)
	assert.equal(err[i].parambulator.code, 'format$')
	i++
      })
      done()
    })
  })

  var pb_multi_require = parambulator({
    required$:['a', 'b'],
    c: 'required$'
  }, {
    multiErrors: true
  })

  it('required all missing', function(done) {
    var props = ['a', 'b', 'c']
    var ent = {}
    pb_multi_require.validate(ent,function(err,res) {
      assert.isNotNull(err)
      assert.equal(err.length, 3)
      var i = 0
      _.each(props, function(prop) {
	assert.equal(err[i].parambulator.property, prop)
	assert.equal(err[i].parambulator.code, 'required$')
	i++
      })
      done()
    })
  })

  it('required partially missing', function(done) {
    var props = ['b', 'c']
    var ent = {a: 1}
    pb_multi_require.validate(ent,function(err,res) {
      assert.isNotNull(err)
      assert.equal(err.length, 2)
      var i = 0
      _.each(props, function(prop) {
	assert.equal(err[i].parambulator.property, prop)
	assert.equal(err[i].parambulator.code, 'required$')
	i++
      })
      done()
    })
  })

  it('required partially missing', function(done) {
    var props = ['a', 'b', 'c']
    var ent = {a: 1, b: 2}
    pb_multi_require.validate(ent,function(err, res) {
      assert.isNotNull(err)
      assert.equal(err.length, 1)
      assert.equal(err[0].parambulator.property, 'c')
      assert.equal(err[0].parambulator.code, 'required$')
      done()
    })
  })


})
