"use strict";

var util = require('util')

var _ = require('underscore')
var gex = require('gex')



var quantrule = function( foundok, rulename ) {
  return function(ctxt,cb) {
    var pn = ctxt.util.proplist(ctxt)

    var found = 0
    pn.forEach(function(p){
      found += ctxt.point[p]?1:0
    })

    if( !foundok(found) ) {
      ctxt.failure = ctxt.util.genfail(ctxt,rulename,''+pn,ctxt.util.formatloc(ctxt.loc))
      return cb(null,ctxt)
    }
    else return cb(null,ctxt);
  }
}



function proplist(ctxt) {
  var pn = ctxt.rulespec

  if( !_.isArray(pn) ) {
    pn = [''+pn]
  }
  
  var all = []
  pn.forEach(function(n){

    if( n.match( /[*?]/ ) ) {
      all = all.concat( _.keys(gex(n).on(ctxt.point)) )
    }
    else all.push(n);
  })

  return all
}


var rulemap = {
  atmostone$:  quantrule( function(f){return f<=1}, 'atmostone$'),
  exactlyone$: quantrule( function(f){return 1==f}, 'exactlyone$'),
  atleastone$: quantrule( function(f){return 1<=f}, 'atleastone$'),



  required$: function(ctxt,cb) {
    var pn = ctxt.util.proplist(ctxt)

    for( var i = 0; i < pn.length; i++ ) {
      var p = pn[i]
      if( !ctxt.point[p] ) {
        ctxt.failure = ctxt.util.genfail(ctxt,'required$',p,ctxt.util.formatloc(ctxt.loc))
        return cb(null,ctxt)
      }
    }

    cb(null,ctxt);
  },



  
  wild$: function(ctxt,cb) {
    var value = ctxt.point

    if( value ) {
      if( !gex(ctxt.rulespec).on(value) ) {
        ctxt.failure = ctxt.util.genfail(ctxt,'wild$',value,ctxt.rulespec,ctxt.util.formatloc(ctxt.loc))
      }
    }

    return cb(null,ctxt);
  },


  eq$: function(ctxt,cb) {
    var value = ctxt.point

    if( value ) {
      if( ctxt.rulespec !== value ) {
        ctxt.failure = ctxt.util.genfail(ctxt,'eq$',value,ctxt.rulespec,ctxt.util.formatloc(ctxt.loc))
      }
    }

    return cb(null,ctxt);
  },


  re$: function(ctxt,cb) {
    var value = ctxt.point

    if( value ) {
      var redef = ctxt.rulespec
      var reopt = void(0)

      var m = /^\/(.*)\/(\w*)$/.exec(ctxt.rulespec)
      if( m ) {
        redef = m[1]
        reopt = m[2]
      }

      var re = new RegExp(redef,reopt)
      //console.log(re)

      if( !re.exec(value) ) {
        ctxt.failure = ctxt.util.genfail(ctxt,'re$',value,re.toString(),ctxt.util.formatloc(ctxt.loc))
      }
    }

    return cb(null,ctxt);
  },



  push$: function(ctxt,cb) {
    var p = ctxt.rulespec
    ctxt.parents.push(ctxt.point)
    ctxt.point = ctxt.point ? ctxt.point[p] : null
    ctxt.loc.push(p)
    cb(null,ctxt)
  },


  pop$: function(ctxt,cb) {
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
  wild$:       "The value '%s' does not match '%s' (location: %s).",
  eq$:         "The value '%s' does not equal '%s' (location: %s).",
  re$:         "The value '%s' does not match %s (location: %s)."
}


function genfail(ctxt) {
  var args = Array.prototype.slice.call(arguments,1)
  var code = args[0]
  args[0] = ctxt.msgs[code] || code
  var err = new Error( util.format.apply(this,args) )
  var errargs = args.slice(1)
  err.parambulator = {loc:ctxt.loc,code:code,args:errargs}

  return err
}


function formatloc(loc) {
  var out = 'top level'
  if( 0 < loc.length ) {
    out = loc.join('.')
  }
  return out
}


function basicfail() {
  var code = arguments[0]
  var ctxt = arguments[1]
  var cb   = arguments[2]

  if( !cb ) {
    ctxt = arguments[0]
    cb   = arguments[1]
    code = ctxt.rulename
  }

  if(!cb) {
    throw new Error('Parambulator: ctxt.util.fail: callback undefined')
  }

  if(!ctxt) {
    return cb(new Error('Parambulator: ctxt.util.fail: ctxt undefined'))
  }

  ctxt.failure = ctxt.util.genfail(ctxt,code,ctxt.rulespec,ctxt.util.formatloc(ctxt.loc))
  return cb(null,ctxt)
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



function descend(r,rulesteps,rules) {
  rulesteps.push({
    rule:rulemap['push$'],
    name:'push$',
    spec:r
  })

  if(_.isArray(rules)) {
    rules.forEach(function(rule){rulesteps.push(rule)})
  }
  else {
    rulesteps.push(rules)
  }
  
  rulesteps.push({
    rule:rulemap['pop$'],
    name:'pop$',
    spec:r
  })

}
  

/*

name$ -> rule name
name  -> property names

*/
function Parambulator( spec, pref ) {
  var self = {}


  var rulenames = proporder(spec)
  var rulesteps = buildrulesteps(spec)
  //console.log(rulesteps)


  function buildrulestep(r,propspec) {
    var rule = (pref && pref.rules) ? pref.rules[r] : null
    if( !rule ) {
      rule = rulemap[r]
    }

    if( rule ) {
      var rulestep = {
        rule:rule,
        name:r,
        spec:propspec
      }
      return rulestep
    }
    else {
      throw new Error("Unknown rule: "+r)
    }
  }


  function buildrulesteps(spec) {
    var rulesteps = []
    var rulenames = proporder(spec)
    rulenames.forEach(function(r){

      var propspec = spec[r]

      // it's a rule - name$ syntax
      if( r.match(/\$$/) ) {
        var rulestep = buildrulestep(r,propspec)
        rulesteps.push(rulestep)
      }

      // it's a property
      else {
        if( _.isObject(propspec) && !_.isArray(propspec) ) {
          var subrulesteps = buildrulesteps( propspec )

          descend(r,rulesteps,subrulesteps)
        }
        else if( _.isString(propspec) ) {
          if( propspec.match(/\$$/) ) {
            var rulestep = buildrulestep(propspec,r)
            rulesteps.push(rulestep)
          }
          else {
            descend(r,rulesteps,{
              rule:rulemap['wild$'],
              name:'wild$',
              spec:propspec
            })
          }
        }
        else {
          throw new Error("Unrecognized rule specification: "+r)
        }
      }   
    })

    return rulesteps
  }



  var msgs = _.extend({},msgsmap,pref?pref.msgs:null)


  self.validate = function( args, cb ) {
    var ctxt = {point:args,msgs:msgs,log:[],loc:[],parents:[]}
    ctxt.util = {genfail:genfail,formatloc:formatloc,fail:basicfail,proplist:proplist}

    function execrule(ruleI, ctxt) {
      if( ruleI < rulesteps.length ) {
        var rulestep = rulesteps[ruleI]

        var isstackop = rulestep.name in {push$:1,pop$:1} 

        if( !ctxt.point && !isstackop ) {
          return execrule(ruleI+1,ctxt)
        }

        ctxt.rulename  = rulestep.name
        ctxt.rulespec  = rulestep.spec

        var specstr = JSON.stringify(rulestep.spec)

        ctxt.log.push('rule:'+rulestep.name+':exec:'+specstr)
        rulestep.rule(ctxt, function(err, ctxt) {
          if( err ) return cb(err,ctxt);

          if( ctxt.failure ) {
            ctxt.log.push('rule:'+rulestep.name+':fail:'+specstr)
            return cb(null,ctxt)
          }
          else {
            ctxt.log.push('rule:'+rulestep.name+':pass:'+specstr)
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
