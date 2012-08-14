
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
      }

    },



  }
}).export(module)

