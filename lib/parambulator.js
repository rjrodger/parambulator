"use strict";

var util = require('util')

var _ = require('underscore')
var gex = require('gex')

//var eyes = require('eyes')





var quantrule = function( foundok, rulename ) {
  return function(ctxt,cb) {
    var pn = ctxt.util.proplist(ctxt)

    var found = 0
    pn.forEach(function(p){
      found += ctxt.point[p]?1:0
    })

    if( !foundok(found) ) {
      var err = ctxt.util.genfail(ctxt,rulename,''+pn,ctxt.util.formatparents(ctxt.parents))
      return cb(err)
    }
    else return cb();
  }
}


var childrule = function( pass, rulename ) {
  return function(ctxt,cb) {
    var pn = ctxt.util.proplist(ctxt)
    //console.log('child '+rulename+' pn='+pn+' '+JSON.stringify(ctxt.rule)+' '+JSON.stringify(ctxt.point))

    for( var i = 0; i < pn.length; i++ ) {
      var p = pn[i]
      if( !pass(ctxt,p) ) {
        var err = ctxt.util.genfail(ctxt,rulename,p,ctxt.util.formatparents(ctxt.parents))
        return cb(err)
      }
    }

    cb();
  }
}


function proplist(ctxt) {
  var pn = ctxt.rule.spec

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


  required$: childrule( function(ctxt,p){return ctxt.point[p]}, 'required$' ),
  notempty$: childrule( function(ctxt,p){return ctxt.point[p] && ''!=ctxt.point[p]}, 'notempty$' ),

  
  wild$: function(ctxt,cb) {
    var value = ctxt.point

    //console.log('WILD '+value)
    //console.dir(ctxt.rule)

    if( value ) {
      if( !gex(ctxt.rule.spec).on(value) ) {
        var err = ctxt.util.genfail(ctxt,'wild$',value,ctxt.rule.spec,ctxt.util.formatparents(ctxt.parents))
        return cb(err)
      }
    }

    return cb();
  },


  eq$: function(ctxt,cb) {
    var value = ctxt.point

    if( value ) {
      if( ctxt.rule.spec !== value ) {
        var err = ctxt.util.genfail(ctxt,'eq$',value,ctxt.rule.spec,ctxt.util.formatparents(ctxt.parents))
        return cb(err)
      }
    }

    return cb();
  },


  re$: function(ctxt,cb) {
    var value = ctxt.point

    if( value ) {
      var redef = ctxt.rule.spec
      var reopt = void(0)

      var m = /^\/(.*)\/(\w*)$/.exec(ctxt.rule.spec)
      if( m ) {
        redef = m[1]
        reopt = m[2]
      }

      var re = new RegExp(redef,reopt)
      //console.log(re)

      if( !re.exec(value) ) {
        var err = ctxt.util.genfail(ctxt,'re$',value,re.toString(),ctxt.util.formatparents(ctxt.parents))
        return cb(err)
      }
    }

    return cb();
  },


  type$: function(ctxt,cb) {
    var typename = ctxt.rule.spec.toLowerCase()
    //console.log('type$:'+typename)

    var checkmap = {
      string:_.isString,
      number:_.isNumber,
      integer:function(v){return _.isNumber(v) && v===(v|0)},
      boolean:_.isBoolean,
      date:_.isDate,
      array:_.isArray,
      object:function(v){return _.isObject(v) && !_.isArray(v)}
    }

    var check = checkmap[typename]

    if( check ) {
      if( !check(ctxt.point) ) {
        var err = ctxt.util.genfail(ctxt,'type$',ctxt.point,typename,ctxt.util.formatparents(ctxt.parents))
        return cb(err)
      }
    }

    return cb();
  },


  iterate$: function(ctxt,cb) {
    var pn = [ctxt.rule.spec.prop]

    if( _.isObject(ctxt.point) && !_.isArray(ctxt.point) ) {
      pn = _.keys(gex( ctxt.rule.spec.prop ).on(ctxt.point))
    }

    //console.log( 'iterate pn='+pn+' prop:'+ctxt.rule.spec.prop+' pnt:'+JSON.stringify(ctxt.point) )

    var subctxt = ctxt.util.clone(ctxt)
    subctxt.rules   = ctxt.rule.spec.rules

    function eachprop(propI) {
      if( propI < pn.length ) {
        var p = pn[propI]
        subctxt.prop  = p
        subctxt.point = ctxt.point[p]
        subctxt.parents = subctxt.parents.concat(p)

        //console.log('p='+p+' ctxt.pnt='+JSON.stringify(ctxt.point))
        
        subctxt.util.execrules(subctxt,function(err){
          if( err ) return cb(err);
          eachprop(propI+1)
        })
      }
      else cb()
    }
    eachprop(0)
  },


  recurse$: function(ctxt,cb) {

    var recurctxt = ctxt.util.clone(ctxt)
    recurctxt.point = {$:ctxt.point}
    recurse('$',recurctxt.point,cb)
    
    function recurse(prop,point,cb) {
      //console.log('recurse:'+prop+' pnt='+JSON.stringify(point))

      if( !_.isObject(point) ) {
        return cb(null)
      }

      var pn = _.keys( point )

      var subctxt = ctxt.util.clone(ctxt)
      subctxt.rules   = ctxt.rule.spec.rules
      subctxt.parents = '$'!=prop?subctxt.parents.concat(prop):subctxt.parents

      function eachprop(propI,cb) {
        if( propI < pn.length ) {
          var p = pn[propI]
          var eachpropctxt = subctxt.util.clone(subctxt)
          eachpropctxt.prop  = p
          eachpropctxt.point = point[p]
          eachpropctxt.parents = '$'!=p?eachpropctxt.parents.concat(p):eachpropctxt.parents

          //console.log('eachprop: '+p+' loc:'+eachpropctxt.parents+' pnt='+JSON.stringify(eachpropctxt.point))

          eachpropctxt.util.execrules(eachpropctxt,function(err){
            if( err ) return cb(err);

            recurse(p,eachpropctxt.point,function(err){
              if( err ) return cb(err);

              eachprop(propI+1,cb)
            })
          })
        }
        else {
          return cb(null)
        }
      }
      eachprop(0,cb)
    }
  },


  descend$: function(ctxt,cb) {
    var subctxt = ctxt.util.clone(ctxt)
    var prop = ctxt.rule.spec.prop

    subctxt.rules   = ctxt.rule.spec.rules
    subctxt.parents = subctxt.parents.concat(prop)
    subctxt.prop    = prop
    subctxt.point   = ctxt.point[prop]

    subctxt.util.execrules(subctxt,function(err){
      if( err ) return cb(err);
      cb(null)
    })
  }

/*
  push$: function(ctxt,cb) {
    var p = ctxt.iterate ? ctxt.iterate.items[ctxt.iterate.index] : ctxt.rule.spec
    ctxt.pointstack.push(ctxt.point)
    ctxt.point = ctxt.point ? ctxt.point[p] : null
    ctxt.parents.push(p)
    cb(null,ctxt)
  },


  pop$: function(ctxt,cb) {
    ctxt.point = ctxt.pointstack.pop()
    ctxt.parents.pop()
    cb(null,ctxt)
  },
*/

  
/*
  select$: function(ctxt,cb) {
    var pn = _.keys(gex( ctxt.rule.spec.prop ).on(ctxt.point))
    console.log( 'pn='+pn )
    ctxt.iterate = {items:pn,index:-1,rule:ctxt.ruleI+1}
    ctxt.cmd = {ruleI:ctxt.rule.spec.jump}
    cb(null,ctxt)
  },

  repeat$: function(ctxt,cb) {
    if( ctxt.iterate ) {
      if( ctxt.iterate.index < ctxt.iterate.length ) {
        ctxt.iterate.index++
        ctxt.cmd = {ruleI:ctxt.iterate.rule}
      }
      else {
        delete ctxt.iterate
      }
    }
    cb(null,ctxt)
  }
*/
}


var msgsmap = {
  atmostone$:  "At most one of these properties can be used at a time: %s (parent: %s).",
  exactlyone$: "Exactly one of these properties must be used: %s (parent: %s).",
  atleastone$: "At least one of these properties is required: %s (parent: %s).",
  required$:   "The property %s is missing and is always required (parent: %s).",
  wild$:       "The value '%s' does not match '%s' (parent: %s).",
  eq$:         "The value '%s' does not equal '%s' (parent: %s).",
  re$:         "The value '%s' does not match %s (parent: %s).",
  type$:       "The value '%s' is not of type '%s' (parent: %s).",
  notempty$:   "The property %s requires a value (parent: %s).",
}




function clone(ctxt) {
  var newctxt = {
    rules:ctxt.rules,
    point:ctxt.point,
    msgs:ctxt.msgs,
    log:ctxt.log,
    parents:ctxt.parents,
    util:ctxt.util
  }
  return newctxt;
}

function genfail(ctxt) {
  var args = Array.prototype.slice.call(arguments,1)
  var code = args[0]
  args[0] = ctxt.msgs[code] || code

  var msg
  if( _.isFunction(args[0]) ) {
    msg = args[0].apply( this, args.slice(1) )
  }
  else msg = util.format.apply(this,args);

  var err = new Error( msg )
  var errargs = args.slice(1)
  err.parambulator = {parents:ctxt.parents,code:code,args:errargs}

  return err
}


function formatparents(parents) {
  var out = 'top level'
  if( 0 < parents.length ) {
    out = parents.join('.')
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
    code = ctxt.rule.name
  }

  if(!cb) {
    throw new Error('Parambulator: ctxt.util.fail: callback undefined')
  }

  if(!ctxt) {
    return cb(new Error('Parambulator: ctxt.util.fail: ctxt undefined'))
  }

  var err = ctxt.util.genfail(ctxt,code,ctxt.rule.spec,ctxt.util.formatparents(ctxt.parents))
  return cb(err)
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
*/




/*

name$ -> rule name
name  -> property names

*/
function Parambulator( spec, pref ) {
  var self = {}


  //var rulenames = proporder(spec)
  var rules = parse(spec)
  //console.dir(rules)
  //eyes.inspect(rules)


  function buildrule(name,rulespec) {
    var func = (pref && pref.rules) ? pref.rules[name] : null
    if( !func ) {
      func = rulemap[name]
    }

    if( func ) {
      var rule = {
        func:func,
        name:name,
        spec:rulespec
      }
      return rule
    }
    else {
      throw new Error("Unknown rule: "+name)
    }
  }


  function parse(spec) {
    var rules = []
    var names = proporder(spec)
    names.forEach(function(name){
      var rulespec = spec[name]

      // it's a rule - name$ syntax
      if( name.match(/\$$/) ) {
        var rule = buildrule(name,rulespec)
        rules.push(rule)
      }


      else if( '**' == name ) {
        var subrules = parse( rulespec )
        var rule = buildrule('recurse$',{prop:name,rules:subrules})
        rules.push(rule)
      }


      // it's a property
      else {
        if( _.isObject(rulespec) && !_.isArray(rulespec) ) {
          var subrules = parse( rulespec )
          var rule = buildrule('iterate$',{prop:name,rules:subrules})
          rules.push(rule)
        }


        else if( _.isString(rulespec) ) {
          if( rulespec.match(/\$$/) ) {
            rules.push( buildrule(rulespec,name) )
          }
          else {
            rules.push( buildrule('descend$',{
              prop:name,rules:[buildrule('wild$',rulespec)]
            }) )
          }
        }


        else {
          throw new Error("Unrecognized rule specification: "+r)
        }
      }   

    })

    return rules
  }



  var msgs = _.extend({},msgsmap,pref?pref.msgs:null)


  self.validate = function( args, cb ) {

/*
    function callrule(rulestep,ruleI,next) {
      //console.log('callrule:'+rulestep.name)

      var isstackop = rulestep.name in {push$:1,pop$:1} 

      if( !ctxt.point && !isstackop ) {
        return next(ruleI+1)
      }

      ctxt.rulename   = rulestep.name
      ctxt.rule.spec   = rulestep.spec
      ctxt.ruleindex  = ruleI

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
          next(ruleI+1)
        }
      })
    }
*/

    function execrules(ctxt,cb) {
      var rules = ctxt.rules
      //console.log('execrules rules.len='+rules.length)

      function execrule(ruleI) {
        if( ruleI < rules.length ) {
          var rule = rules[ruleI]
          //console.log('start execrule: '+rule.name+' '+rule.spec+' ctxt.pnt='+JSON.stringify(ctxt.point))

          if( !ctxt.point ) {
            return execrule(ruleI+1)
          }
          
          ctxt.rule = rule

          var specstr = JSON.stringify(rule.spec)

          ctxt.log.push('rule:'+rule.name+':exec:'+specstr)

          //console.log('exec rule '+rule.name)
          rule.func(ctxt, function(err) {
            //console.log('cb rule '+rule.name)
            
            if( err ) {
              ctxt.log.push('rule:'+rule.name+':fail:'+specstr)
              return cb(err,{log:ctxt.log})
            }
            else {
              ctxt.log.push('rule:'+rule.name+':pass:'+specstr)
              execrule(ruleI+1)
            }
          })
          //console.log('after rule '+rule.name)
        }
        else {
          cb(null)
        }
      }

      execrule(0)
    }


    var ctxt = {rules:rules,point:args,msgs:msgs,log:[],parents:[]}
    ctxt.util = {genfail:genfail,formatparents:formatparents,fail:basicfail,proplist:proplist,execrules:execrules,clone:clone}

    execrules(ctxt,function(err){
      cb(err,{log:ctxt.log})
    })
  }


  return self
}


exports.ownparams = new Parambulator({
  strings$: ['required$','notempty$','atmostone$','exactlyone$','atleastone$']
}, {
  rules: {
    strings$: function(ctxt,cb){
      var pn = ctxt.rule.spec

      if( !_.isArray(pn) ) {
        pn = [''+pn]
      }
      
      //console.log(pn)

      for( var pI = 0; pI < pn.length; pI++ ) {
        var p   = pn[pI]
        var val = ctxt.point[p]
        //console.log(i+val)

        if( !_.isUndefined(val) ) {
          if( _.isString(val) ) {
            // ok
          }
          else if( _.isArray(val) ) {
            for(var i = 0; i < val.length; i++ ) {
              if( !_.isString(val[i]) ) {
                return cb(ctxt.util.genfail(ctxt,'strings$',p,ctxt.util.formatparents(ctxt.parents)))
              }
            }
          }
          else {
            return cb(ctxt.util.genfail(ctxt,'strings$',p,ctxt.util.formatparents(ctxt.parents)))
          }
        }
      }

      cb(null)      
    }
  },
  msgs: {
    'strings$': 'The %s rule needs a string or array of strings (property: %s).'
  }
})


exports.Parambulator = Parambulator
