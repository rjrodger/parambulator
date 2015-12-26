/* Copyright (c) 2010-2013 Richard Rodger */

'use strict';

var Lab = require('lab')
var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var assert = require('chai').assert
var gex    = require('gex')

var parambulator = require('..')



describe('type', function() {

  var pb = parambulator({
    a: {type$:'string'},
    b: {type$:'number'},
    c: {type$:'integer'},
    d: {type$:'boolean'},
    e: {type$:'date'},
    f: {type$:'array'},
    g: {type$:'object'},
    h: {type$:['date','string','array']},
    i: {type$:['object']},
  })


  it('multi-types-1', function(done) {
    pb.validate({},function(err,res){
      assert.isNull(err)
    })

    pb.validate({h:'foo'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({h:new Date()},function(err,res){
      assert.isNull(err)
    })

    pb.validate({h:[1, 2, '3']},function(err,res){
      assert.isNull(err)
    })

    pb.validate({h:11.1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb.validate({h:1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb.validate({h:true},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb.validate({h:{a:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
      done()
  })

  it('multi-types-2', function(done) {
    pb.validate({},function(err,res){
      assert.isNull(err)
    })

    pb.validate({i:'foo'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb.validate({i:new Date()},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb.validate({i:[1, 2, '3']},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb.validate({i:11.1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb.validate({i:1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb.validate({i:true},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb.validate({i:{a:1}},function(err,res){
      assert.isNull(err)
    })
      done()
  })



  it('string', function(done) {
    pb.validate({},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:'foo'},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
      done()
  })



  it('number', function(done) {
    pb.validate({b:1.1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({b:'foo'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
      done()
  })


  it('integer', function(done) {
    pb.validate({c:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({c:1.1},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
      done()
  })


  it('boolean', function(done) {
    pb.validate({d:true},function(err,res){
      assert.isNull(err)
    })

    pb.validate({d:false},function(err,res){
      assert.isNull(err)
    })

    pb.validate({d:'foo'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
      done()
  })


  it('date', function(done) {
    pb.validate({e:new Date()},function(err,res){
      assert.isNull(err)
    })

    pb.validate({e:'foo'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb.validate({e:{a:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
      done()
  })


  it('array', function(done) {
    pb.validate({f:[]},function(err,res){
      assert.isNull(err)
    })

    pb.validate({f:[11]},function(err,res){
      assert.isNull(err)
    })

    pb.validate({f:'foo'},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb.validate({f:{a:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
      done()
  })


  it('object', function(done) {
    pb.validate({g:null},function(err,res){
      assert.isNull(err)
    })

    pb.validate({g:{}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({g:{a:1}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({g:new Date()},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })

    pb.validate({g:[]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'type$')
    })
      done()
  })
})
