/* Copyright (c) 2010-2013 Richard Rodger */

'use strict';

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var assert = require('chai').assert
var gex    = require('gex')

var parambulator = require('..')



describe('format', function() {

  var pb

  it('happy', function(done) {
    pb = parambulator({
      a: {format$:'datetime'},
      b: {format$:'date'},
      c: {format$:'time'},
      d: {format$:'utcmillisec'},
      e: {format$:'re'},
      f: {format$:['date', 'time']},
    })
      done()
  })

  it('datetime', function(done) {
    pb.validate({},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:'2012-02-02T11:12:13Z'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:'2012-02-02'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })
      done()
  })

  it('date', function(done) {
    pb.validate({},function(err,res){
      assert.isNull(err)
    })

    pb.validate({b:'2012-02-02'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({b:'2012-32-02'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })
      done()
  })

  it('time', function(done) {
    pb.validate({},function(err,res){
      assert.isNull(err)
    })

    pb.validate({c:'11:12:13Z'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({c:'51:12:13Z'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })
      done()
  })

  it('utcmillisec', function(done) {
    pb.validate({},function(err,res){
      assert.isNull(err)
    })

    pb.validate({d:124578},function(err,res){
      assert.isNull(err)
    })

    pb.validate({d:'test'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })
      done()
  })

  it('re', function(done) {
    pb.validate({},function(err,res){
      assert.isNull(err)
    })

    pb.validate({e:/([0-1]\d|2[0-4]):[0-5]\d:[0-5]\dZ/},function(err,res){
      assert.isNull(err)
    })

    pb.validate({e:124578},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })
      done()
  })


  it('date-time', function(done) {
    pb.validate({},function(err,res){
      assert.isNull(err)
    })

    pb.validate({f:'2012-02-02'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({f:'2012-32-02'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })

    pb.validate({f:'11:12:13Z'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({f:'51:12:13Z'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })

    pb.validate({f:124578},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })

    pb.validate({f:/([0-1]\d|2[0-4]):[0-5]\d:[0-5]\dZ/},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })

    pb.validate({f:124578},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })

    pb.validate({f:'test'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'format$')
    })
      done()
  })
})
