
var vows   = require('vows')
var assert = require('assert')
var gex    = require('gex')

var parambulator = require('../lib/parambulator.js')



vows.describe('basic').addBatch({
  'happy': {
    topic: function() {
      try {
        return new parambulator.Parambulator({

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
        })
      } catch( e ) {
        console.log(e.stack)
        throw e
      }
    },



    'required$': function( pb ) {
      pb.validate({a:1,red:1,foo:1,bar:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:1,red:1,foo:1},function(err,res){
        assert.isNotNull(err)
        assert.equal('required$',err.parambulator.code)
      })

      pb.validate({a:1,red:1,bar:1},function(err,res){
        assert.isNotNull(err)
        assert.equal('required$',err.parambulator.code)
      })

      pb.validate({a:1,red:1,},function(err,res){
        assert.isNotNull(err)
        assert.equal('required$',err.parambulator.code)
      })
    },


    'exactlyone$': function( pb ) {
      pb.validate({a:1,red:1, foo:1,bar:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:1,blue:1, foo:1,bar:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:1,foo:1,bar:1},function(err,res){
        assert.isNotNull(err)
        assert.equal('exactlyone$',err.parambulator.code)
      })

      pb.validate({a:1,red:1,blue:1, foo:1,bar:1},function(err,res){
        assert.isNotNull(err)
        assert.equal('exactlyone$',err.parambulator.code)
      })
    },


    'atmostone$': function( pb ) {
      pb.validate({a:1,red:1,foo:1,bar:1, from:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:1,red:1,foo:1,bar:1, path:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:1,red:1,foo:1,bar:1, path:1,from:1},function(err,res){
        assert.isNotNull(err)
        assert.equal('atmostone$',err.parambulator.code)
      })
    },


    'atleastone$': function( pb ) {
      pb.validate({red:1,foo:1,bar:1,from:1, a:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({red:1,foo:1,bar:1,from:1, b:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({red:1,foo:1,bar:1,from:1, a:1,b:1},function(err,res){
        assert.isNull(err)
      })

      pb.validate({red:1,foo:1,bar:1,from:1 },function(err,res){
        assert.isNotNull(err)
        assert.equal('atleastone$',err.parambulator.code)
      })
    },


    'search': function( pb ) {
      pb.validate({a:1,red:1,foo:1,bar:1, search:{find:1,replace:1}},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:1,red:1,foo:1,bar:1, search:{find:1}},function(err,res){
        assert.isNotNull(err)
        assert.equal('required$',err.parambulator.code)
      })

      pb.validate({a:1,red:1,foo:1,bar:1, search:{replace:1}},function(err,res){
        assert.isNotNull(err)
        assert.equal('required$',err.parambulator.code)
      })
    },


    'sublevels': function( pb ) {
      pb.validate({a:1,red:1,foo:1,bar:1, sub:{dub:{x:1}}},function(err,res){
        assert.isNull(err)
      })
      pb.validate({a:1,red:1,foo:1,bar:1, sub:{dub:{y:1}}},function(err,res){
        assert.isNull(err)
      })
      pb.validate({a:1,red:1,foo:1,bar:1, sub:{dub:{z:1}}},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:1,red:1,foo:1,bar:1, sub:{dub:{}}},function(err,res){
        assert.isNotNull(err)
        assert.equal('exactlyone$',err.parambulator.code)
      })

      pb.validate({a:1,red:1,foo:1,bar:1, sub:{dub:{x:1,y:1}}},function(err,res){
        assert.isNotNull(err)
        assert.equal('exactlyone$',err.parambulator.code)
      })

      pb.validate({a:1,red:1,foo:1,bar:1, sub:{dub:{x:1,y:1,z:1}}},function(err,res){
        assert.isNotNull(err)
        assert.equal('exactlyone$',err.parambulator.code)
      })
    },


  }
}).export(module)

