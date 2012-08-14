
var vows   = require('vows')
var assert = require('assert')
var gex    = require('gex')
var _      = require('underscore')

var parambulator = require('../lib/parambulator.js')



vows.describe('ownparams').addBatch({
  'happy': {
    topic: function() {
      try {
        return new parambulator.Parambulator({
          strings$: 'required$'
        }, {
          rules: {
            strings$: function(ctxt,cb){
              var val = ctxt.point[ctxt.rule.spec]

              if( _.isString(val) ) {
                return cb(null)
              }
              else if( _.isArray(val) ) {
                for(var i = 0; i < val.length; i++ ) {
                  if( !_.isString(val[i]) ) {
                    return ctxt.util.fail(ctxt,cb)
                  }
                }
                return cb(null)
              }
              else {
                return ctxt.util.fail(ctxt,cb)
              }

            }
          },
          msgs: {
            'strings$': 'required$, string or array of strings: '
          }
        })
      } 
      catch( e ) {
        console.log(e.stack)
        throw e
      }
    },



    'strings$': function( pb ) {
      pb.validate({required$:'foo'},function(err,res){
        assert.isNull(err)
      })

      pb.validate({required$:['foo','bar']},function(err,res){
        assert.isNull(err)
      })


      pb.validate({required$:1},function(err,res){
        //console.dir(res.failure)
        assert.isNotNull(err)
        assert.equal(err.parambulator.code,'strings$')
      })

    },



  }
}).export(module)

