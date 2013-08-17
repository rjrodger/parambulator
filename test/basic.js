/* Copyright (c) 2010-2013 Richard Rodger */

"use strict";


var assert = require('chai').assert
var gex    = require('gex')

var parambulator = require('..')


describe('basic', function() {

  var pb

  it('happy', function() {
    pb = parambulator({
      atmostone$: ['path','from'],

      search: {
        required$: ['find','replace']
      },

      exactlyone$: ['red','blue'],
      atleastone$: ['a','b'],

      sub: {
        dub: {
          exactlyone$: ['x','y','z'],
        }
      },

      required$: ['foo','bar'],
      notempty$: ['z'],
    })
  }) 


  it('required$', function() {
    pb.validate({a:1,z:1,red:1,foo:1,bar:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })
    
    pb.validate({a:1,z:1,red:1,bar:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })
  })


  it('exactlyone$', function() {
    pb.validate({a:1,z:1,red:1, foo:1,bar:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,blue:1, foo:1,bar:1},function(err,res){
      assert.isNull(err)
    })
    
    pb.validate({a:1,z:1,foo:1,bar:1},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })
    
    pb.validate({a:1,z:1,red:1,blue:1, foo:1,bar:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })
  })


  it('atmostone$', function() {
    pb.validate({a:1,z:1,red:1,foo:1,bar:1, from:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, path:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, path:1,from:1},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('atmostone$',err.parambulator.code)
    })
  })


  it('atleastone$', function() {
    pb.validate({z:1, red:1,foo:1,bar:1,from:1, a:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({z:1, red:1,foo:1,bar:1,from:1, b:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({red:1,foo:1,bar:1,from:1, a:1,z:1,b:1},function(err,res){
      assert.isNull(err)
    })

    pb.validate({z:1, red:1,foo:1,bar:1,from:1 },function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('atleastone$',err.parambulator.code)
    })
  })


  it('search', function() {
    pb.validate({a:1,z:1,red:1,foo:1,bar:1, search:{find:1,replace:1}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, search:{find:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, search:{replace:1}},function(err,res){
      assert.isNotNull(err)
      assert.equal('required$',err.parambulator.code)
    })
  })



  it('sublevels', function() {
    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{x:1}}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{y:1}}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{z:1}}},function(err,res){
      assert.isNull(err)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{}}},function(err,res){
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{x:1,y:1}}},function(err,res){
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })

    pb.validate({a:1,z:1,red:1,foo:1,bar:1, sub:{dub:{x:1,y:1,z:1}}},function(err,res){
      assert.isNotNull(err)
      assert.equal('exactlyone$',err.parambulator.code)
    })
  })


  it('notempty$', function() {
    pb.validate({a:1,z:'',red:1,foo:1,bar:1},function(err,res){
      //console.log(err)
      assert.isNotNull(err)
      assert.equal('notempty$',err.parambulator.code)
    })

    pb.validate({a:1,z:null,red:1,foo:1,bar:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('notempty$',err.parambulator.code)
    })

    pb.validate({a:1,z:undefined,red:1,foo:1,bar:1},function(err,res){
      assert.isNotNull(err)
      assert.equal('notempty$',err.parambulator.code)
    })
  })
})


