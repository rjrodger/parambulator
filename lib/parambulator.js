"use strict";

var util = require('util')

var _ = require('underscore')


var rulemap = {
  exclusive: function(ctxt,cb) {
    var pn = ctxt.rulespec

    var found = 0
    pn.forEach(function(p){
      found += ctxt.point[p]?1:0
    })

    if( 1 < found ) {
      cb(generr(ctxt,'exclusive',''+pn),ctxt)
    }
    else cb(null,ctxt);
  }
}


var msgsmap = {
  exclusive: "These properties are mutually exclusive: %s."
}


function generr(ctxt) {
  var args = Array.prototype.slice.call(arguments,1)
  args[0] = ctxt.msgs[args[0]] || args[0]
  return new Error( util.format.apply(this,args) )
}


// Return an ordered array of property names. The prefix __ is removed
// from property names, both in the returned array, and the original
// object.
function proporder(obj) {
  var pn = []
  for( var p in obj ) {
    var pc = p
    if( 0 == p.indexOf('__') ) {
      pc = p.substring(2)
      obj[pc] = obj[p]
      delete obj[p]
    }
    pn.push(pc)
  }
  return pn
}


function Parambulator( spec ) {
  var self = {}

  var rulenames = proporder(spec.rules)
  console.log(rulenames)

  var rules = []
  rulenames.forEach(function(r){
    var rule = spec.defs ? spec.defs[r] : null
    if( !rule ) {
      rule = rulemap[r]
    }

    if( rule ) {
      rule.rulename = r
      rule.rulespec = spec.rules[r]
      rules.push(rule)
    }
    else {
      throw new Error("Unknown rule: "+r)
    }
  })

  console.log('rs:'+rules)

  var msgs = _.extend({},msgsmap,spec.msgs)


  self.validate = function( args, cb ) {
    var ctxt = {point:args,msgs:msgs,log:[]}

    function execrule(ruleI, ctxt) {
      if( ruleI < rules.length ) {
        var rule = rules[ruleI]
      
        ctxt.rulename = rule.rulename
        ctxt.rulespec = rule.rulespec

        ctxt.log.push('rule:'+rule.rulename+':exec')
        rule(ctxt, function(err, ctxt) {
          if( err ) return cb(err,ctxt);

          if( ctxt.failure ) {
            ctxt.log.push('rule:'+rule.rulename+':fail')
            return cb(null,ctxt.failure)
          }
          else {
            ctxt.log.push('rule:'+rule.rulename+':pass')
          }

          execrule(ruleI+1,ctxt)
        })
      }
      else {
        cb(null,ctxt)
      }
    }

    execrule(0, ctxt)
  }

  return self
}



exports.Parambulator = Parambulator
