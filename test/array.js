/* Copyright (c) 2010-2013 Richard Rodger */

"use strict";


var assert = require('chai').assert
var gex    = require('gex')

var parambulator = require('..')



describe('array', function() {

  var pb
  
  it('happy', function() {
    pb = new parambulator({
      z: 'required$',
      foo: {
        
        '__1': {
          bar: 'required$'
        },
        
        '__0': 'required$',
      },
    })
  })


  it('z', function() {
    pb.validate({z:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'required$')
    })
  })


  it('index0', function() {
    pb.validate({z:1},function(err,res){
      assert.isNull(err)
    })
    
    pb.validate({z:1,foo:[10]},function(err,res){
      assert.isNull(err)
    })
    
    pb.validate({z:1,foo:[]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'required$')
    })
  })


  it('index1', function() {

    pb.validate({z:1,foo:[10]},function(err,res){
      assert.isNull(err)
    })

    pb.validate({z:1,foo:[{},{bar:1}]},function(err,res){
      assert.isNull(err)
    })

    pb.validate({z:1,foo:[{},{}]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'required$')
    })

    pb.validate({z:1,foo:[{},{barx:1}]},function(err,res){
      assert.isNotNull(err)
      assert.equal(err.parambulator.code,'required$')
    })
  })
})

