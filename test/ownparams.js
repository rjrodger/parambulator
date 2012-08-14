
var vows   = require('vows')
var assert = require('assert')
var gex    = require('gex')
var _      = require('underscore')

var parambulator = require('../lib/parambulator.js')



vows.describe('ownparams').addBatch({
  'happy': {
    topic: function() {
      try {
        return parambulator.ownparams
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },



    'strings$': function( pb ) {

      for( var r in {required$:1,notempty$:1,atmostone$:1,exactlyone$:1,atleastone$:1} ) {
        var args = {}


        args[r]='foo'
        pb.validate(args,function(err,res){
          assert.isNull(err)
        })


        args[r]=['foo','bar']
        pb.validate(args,function(err,res){
          assert.isNull(err)
        })

        args[r]=1
        pb.validate(args,function(err,res){
          //console.dir(err)
          assert.isNotNull(err)
          assert.equal(err.parambulator.code,'strings$')
        })


        args = {}

        args['foo']={}
        args['foo'][r]='bar'
        pb.validate(args,function(err,res){
          assert.isNull(err)
        })

        args['foo']={}
        args['foo'][r]=1
        pb.validate(args,function(err,res){
          //console.dir(err)
          assert.isNotNull(err)
          assert.equal(err.parambulator.code,'strings$')
        })
      }

    },


    'wild$': function( pb ) {
      pb.validate({a:{wild$:'b*'}},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:{wild$:1}},function(err,res){
        //console.dir(err)
        //console.dir(res)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },


    'type$': function( pb ) {
      pb.validate({a:{type$:'string'}},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:{type$:1}},function(err,res){
        //console.dir(err)
        //console.dir(res)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },


    're$': function( pb ) {
      pb.validate({a:{re$:'/b/'}},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:{re$:1}},function(err,res){
        //console.dir(err)
        //console.dir(res)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },


    'enum$': function( pb ) {
      pb.validate({a:{enum$:[11,22]}},function(err,res){
        assert.isNull(err)
      })

      pb.validate({a:{enum$:1}},function(err,res){
        //console.dir(err)
        //console.dir(res)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'type$')
      })
    },

  }
}).export(module)

