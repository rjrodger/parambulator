"use strict";

var util = require('util')

var _ = require('underscore')



var quantrule = function( foundok, rulename ) {
  return function(ctxt,cb) {
    var pn = ctxt.rulespec

    var found = 0
    pn.forEach(function(p){
      found += ctxt.point[p]?1:0
    })

    if( !foundok(found) ) {
      return cb(ctxt.util.generr(ctxt,rulename,''+pn,ctxt.util.formatloc(ctxt.loc)),ctxt)
    }
    else return cb(null,ctxt);
  }
}

var rulemap = {

/*
  xatmostone$: function(ctxt,cb) {
    var pn = ctxt.rulespec

    var found = 0
    pn.forEach(function(p){
      found += ctxt.point[p]?1:0
    })

    if( 1 < found ) {
      return cb(ctxt.util.generr(ctxt,'atmostone$',''+pn,ctxt.util.formatloc(ctxt.loc)),ctxt)
    }
    else return cb(null,ctxt);
  },

  xexactlyone$: function(ctxt,cb) {
    var pn = ctxt.rulespec

    var found = 0
    pn.forEach(function(p){
      found += ctxt.point[p]?1:0
    })

    if( 1 != found ) {
      return cb(ctxt.util.generr(ctxt,'exactlyone$',''+pn,ctxt.util.formatloc(ctxt.loc)),ctxt)
    }
    else return cb(null,ctxt);
  },
*/

  atmostone$:  quantrule( function(f){return f<=1}, 'atmostone$'),
  exactlyone$: quantrule( function(f){return 1==f}, 'exactlyone$'),
  atleastone$: quantrule( function(f){return 1<=f}, 'atleastone$'),



  required$: function(ctxt,cb) {
    var pn = ctxt.rulespec

    if( !_.isArray(pn) ) {
      pn = [''+pn]
    }

    for( var i = 0; i < pn.length; i++ ) {
      var p = pn[i]
      if( !ctxt.point[p] ) {
        return cb(ctxt.util.generr(ctxt,'required$',p,ctxt.util.formatloc(ctxt.loc)),ctxt)
      }
    }

    cb(null,ctxt);
  },







  push: function(ctxt,cb) {
    var p = ctxt.rulespec
    ctxt.parents.push(ctxt.point)
    ctxt.point = ctxt.point[p]
    ctxt.loc.push(p)
    cb(null,ctxt)
  },


  pop: function(ctxt,cb) {
    ctxt.point = ctxt.parents.pop()
    ctxt.loc.pop()
    cb(null,ctxt)
  }

}


var msgsmap = {
  atmostone$:  "At most one of these properties can be used at a time: %s (location: %s).",
  exactlyone$: "Exactly one of these properties must be used: %s (location: %s).",
  atleastone$: "At least one of these properties is required: %s (location: %s).",
  required$:   "The property %s is missing and is always required (location: %s).",
}


function generr(ctxt) {
  var args = Array.prototype.slice.call(arguments,1)
  var code = args[0]
  args[0] = ctxt.msgs[code] || code
  var err = new Error( util.format.apply(this,args) )
  err.parambulator = {loc:ctxt.loc,code:code,args:args.slice(1)}
  return err
}


function formatloc(loc) {
  var out = 'top level'
  if( 0 < loc.length ) {
    out = loc.join('.')
  }
  return out
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



/*

name$ -> rule name
name  -> property names

*/
function Parambulator( spec ) {
  var self = {}

  var rulenames = proporder(spec)
  //console.log(rulenames)



  function buildrulesteps(spec) {
    var rulesteps = []
    var rulenames = proporder(spec)
    rulenames.forEach(function(r){

      // it's a rule - name$ syntax
      if( r.match(/\$$/) ) {
        var rule = spec.defs ? spec.defs[r] : null
        if( !rule ) {
          rule = rulemap[r]
        }

        if( rule ) {
          var rulestep = {
            rule:rule,
            name:r,
            spec:spec[r]
          }

          rulesteps.push(rulestep)
        }
        else {
          throw new Error("Unknown rule: "+r)
        }
      }

      // it's a property
      else {
        var subrulesteps = buildrulesteps(spec[r])
        //console.dir(subrulesteps)

        var pushstep = {
          rule:rulemap['push'],
          name:'push',
          spec:r
        }
        var popstep = {
          rule:rulemap['pop'],
          name:'pop',
          spec:r
        }

        rulesteps.push(pushstep)
        rulesteps = rulesteps.concat(subrulesteps)
        rulesteps.push(popstep)
      }   
    })

    return rulesteps
  }

  var rulesteps = buildrulesteps(spec)

  //console.dir(rulesteps)

  var msgs = _.extend({},msgsmap,spec.msgs)


  self.validate = function( args, cb ) {
    var ctxt = {point:args,msgs:msgs,log:[],loc:[],parents:[]}
    ctxt.util = {generr:generr,formatloc:formatloc}

    function execrule(ruleI, ctxt) {
      if( ruleI < rulesteps.length ) {
        var rulestep = rulesteps[ruleI]

        //console.log(ruleI)
        //console.dir(rulestep)
        //console.dir(ctxt.point)
        //console.dir(ctxt.parents)
        //console.dir(ctxt.loc)

        if( !ctxt.point && 'pop' != rulestep.name ) {
          return execrule(ruleI+1,ctxt)
        }


      
        ctxt.rulename = rulestep.name
        ctxt.rulespec = rulestep.spec

        ctxt.log.push('rule:'+rulestep.name+':exec')
        rulestep.rule(ctxt, function(err, ctxt) {
          if( err ) return cb(err,ctxt);

          if( ctxt.failure ) {
            ctxt.log.push('rule:'+rulestep.name+':fail')
            return cb(null,ctxt.failure)
          }
          else {
            ctxt.log.push('rule:'+rulestep.name+':pass')
          }

          return execrule(ruleI+1,ctxt)
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
