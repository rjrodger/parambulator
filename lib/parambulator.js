/*
Copyright (c) 2012 Richard Rodger

BSD License
-----------

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

1. Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

3. The names of the copyright holders and contributors may not be used
to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE
*/


"use strict";

var util = require('util')

var _ = require('underscore')
var gex = require('gex')






var quantrule = function( foundok, rulename ) {
  return function(ctxt,cb) {
    ctxt.prop = null

    var pn = ctxt.util.proplist(ctxt)

    var found = 0
    pn.forEach(function(p){
      found += ctxt.point[p]?1:0
    })

    if( !foundok(found) ) {
      ctxt.value = ''+pn
      return ctxt.util.fail(ctxt,cb)
    }
    else return cb();
  }
}


var childrule = function( pass, noneok, rulename ) {
  return function(ctxt,cb) {
    var pn = ctxt.util.proplist(ctxt)
    //console.log('child '+rulename+' pn='+pn+' '+JSON.stringify(ctxt.rule)+' '+JSON.stringify(ctxt.point))

    for( var i = 0; i < pn.length; i++ ) {
      var p = pn[i]
      ctxt.prop = p

      //console.log(i+'='+p+' of '+pn)

      if( !pass(ctxt,p) ) {
        return ctxt.util.fail(ctxt,cb)
      }
    }

    if( 0 == pn.length ) {
      if( !noneok() ) {
        // TODO needs a separate msg code
        ctxt.prop = JSON.stringify(ctxt.rule.spec)
        return ctxt.util.fail(ctxt,cb)
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


  required$: childrule( 
    function(ctxt,p){return !_.isUndefined(ctxt.point[p])}, 
    function(){return false}, 
    'required$' 
  ),
  notempty$: childrule( 
    function(ctxt,p){
      return !_.isUndefined(ctxt.point[p]) && !_.isNull(ctxt.point[p]) && ''!=ctxt.point[p]
    }, 
    function(){return true}, 
    'notempty$' 
  ),

  
  wild$: function(ctxt,cb) {
    var value = ctxt.point

    if( !_.isUndefined(value) ) {
      if( !gex(ctxt.rule.spec).on(value) ) {
        return ctxt.util.fail(ctxt,cb)
      }
    }

    return cb();
  },


  eq$: function(ctxt,cb) {
    var value = ctxt.point

    if( !_.isUndefined(value) ) {
      if( ctxt.rule.spec !== value ) {
        return ctxt.util.fail(ctxt,cb)
      }
    }

    return cb();
  },


  re$: function(ctxt,cb) {
    var value = ctxt.point

    if( !_.isUndefined(value) ) {
      value = ''+value
      var redef = ctxt.rule.spec
      var reopt = void(0)

      var m = /^\/(.*)\/(\w*)$/.exec(ctxt.rule.spec)
      if( m ) {
        redef = m[1]
        reopt = m[2]
      }

      var re = new RegExp(redef,reopt)

      if( !re.exec(value) ) {
        return ctxt.util.fail(ctxt,cb)
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
        return ctxt.util.fail(ctxt,cb)
      }
    }

    return cb();
  },



  enum$: function(ctxt,cb) {
    var value = ctxt.point
    var okvals = ctxt.rule.spec

    if( value ) {
      for( var i = 0; i < okvals.length; i++ ) {
        if( -1 == okvals.indexOf(value) ) {
          return ctxt.util.fail(ctxt,cb)
        }
      }
    }

    return cb();
  },



  // internal rules


  iterate$: function(ctxt,cb) {
    var pn = [ctxt.rule.spec.prop]

    if( _.isObject(ctxt.point) ) { 
      if( _.isArray(ctxt.point) ) {
        pn = gex( ctxt.rule.spec.prop ).on( _.range(ctxt.point.length))
      }
      else {
        pn = _.keys(gex( ctxt.rule.spec.prop ).on(ctxt.point))
      }
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

}


var msgsmap = {
  atmostone$:  "At most one of these properties can be used at a time: '<%=value%>'  (parent: <%=parentpath%>).",
  exactlyone$: "Exactly one of these properties must be used: '<%=value%>' (parent: <%=parentpath%>).",
  atleastone$: "At least one of these properties is required: '<%=value%>' (parent: <%=parentpath%>).",

  required$:   "The property '<%=property%>' is missing and is always required (parent: <%=parentpath%>).",
  notempty$:   "The property '<%=property%>' requires a value (parent: <%=parentpath%>).",

  wild$:       "The value <%=value%> does not match the expression '<%=rule.spec%>' (parent: <%=parentpath%>).",
  re$:         "The value <%=value%> does not match the regular expression <%=rule.spec%> (parent: <%=parentpath%>).",
  type$:       "The value <%=value%> is not of type '<%=rule.spec%>' (parent: <%=parentpath%>).",

  eq$:         "The value <%=value%> does not equal '<%=rule.spec%>' (parent: <%=parentpath%>).",
  enum$:       "The value <%=value%> must be one of '<%=rule.spec%>' (parent: <%=parentpath%>).",
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


function formatparents(parents) {
  var out = 'top level'
  if( 0 < parents.length ) {
    out = parents.join('.')
  }
  return out
}



function fail() {
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

  var inserts = {
    property:ctxt.prop,
    value:ctxt.value||JSON.stringify(ctxt.point),
    point:ctxt.point,
    rule:ctxt.rule,
    parentpath:formatparents(ctxt.parents),
    json:function(v){return JSON.stringify(v)}
  }

  var msg = ctxt.msgs[code] || code
  
  if( _.isFunction(msg) ) {
    msg = msg(inserts,ctxt)
  }
  else msg = _.template(msg,inserts)

  var err = new Error( msg )
  err.parambulator = {parents:ctxt.parents,code:code,point:ctxt.point,rule:ctxt.rule}

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

name$ -> rule name
name  -> property names

*/
function Parambulator( spec, pref ) {
  var self = {}

  if( !spec || !_.isObject(spec) || _.isArray(spec) ) {
    throw new Error('Parambulator: spec argument is not an object')
  }

  if( exp.ownparams ) {
    exp.ownparams.validate(spec,function(err){
      if( err ) throw err;
    })
  }

  if( pref && pref.valid && exp ) {
    var prefparams = exp({'**':pref.valid})
    prefparams.validate(spec,function(err){
      if( err ) throw err;
    })
  }



  //var rulenames = proporder(spec)
  var rules = parse(spec)
  //console.dir(rules)
  //if( pref && !pref.__ownparams__ ) { require('eyes').inspect(rules) }


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
      throw new Error("Parambulator: Unknown rule: "+name)
    }
  }


  function parse(spec) {
    var rules = []
    var names = proporder(spec)
    names.forEach(function(name){
      var rulespec = spec[name]


      // enables multiple rules of same name
      if( 'list$' == name ) {
        for(var i = 0; i < rulespec.length; i++) {
          var rs = {}
          rs[rulespec[i][0]]=rulespec[i][1]
          //console.log(rs)
          rules.push(parse(rs)[0])
        }
      }

      // enables quoting of property names that end in $
      else if( 'prop$' == name ) {
        var subrules = parse( rulespec.rules )
        var rule = buildrule('descend$',{prop:rulespec.name,rules:subrules})
        rules.push(rule)
      }


      // it's a rule - name$ syntax
      else if( name.match(/\$$/) ) {
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

          // foo:'required$'
          if( rulespec.match(/\$$/) ) {
            rules.push( buildrule(rulespec,name) )
          }

          // foo:'bar*'
          else {
            rules.push( buildrule('descend$',{
              prop:name,rules:[buildrule('wild$',rulespec)]
            }) )
          }
        }


        else {
          throw new Error("Parambulator: Unrecognized rule specification: "+r)
        }
      }   

    })

    return rules
  }



  var msgs = _.extend({},msgsmap,pref?pref.msgs:null)


  self.validate = function( args, cb ) {

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
          cb(null,{log:ctxt.log})
        }
      }

      execrule(0)
    }


    var ctxt = {rules:rules,point:args,msgs:msgs,log:[],parents:[]}
    ctxt.util = {formatparents:formatparents,fail:fail,proplist:proplist,execrules:execrules,clone:clone}

    execrules(ctxt,function(err){
      cb(err,{log:ctxt.log})
    })
  }


  return self
}


var exp = function(){
  var args = Array.prototype.slice.call(arguments)
  return Parambulator.apply(this,args)
}

// this is where Parambulator validates it's own input
exp.ownparams = new Parambulator({
  '**': 
  {
    strings$: ['required$','notempty$','atmostone$','exactlyone$','atleastone$'],
    list$:[
      ['prop$',{name:'wild$', rules:{type$:'string'}}],
      ['prop$',{name:'type$', rules:{type$:'string'}}],
      ['prop$',{name:'re$',   rules:{type$:'string'}}],

      ['prop$',{name:'type$', rules:{enum$:['string','number','integer','boolean','date','array','object',]}}],

      ['prop$',{name:'enum$', rules:{type$:'array'}}],
      ['prop$',{name:'list$', rules:{type$:'array'}}],
    ]
  }
}, {
  __ownparams__:true,
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
                ctxt.prop = p
                return ctxt.util.fail(ctxt,cb)
              }
            }
          }
          else {
            ctxt.prop = p
            return ctxt.util.fail(ctxt,cb)
          }
        }
      }

      cb(null)      
    }
  },
  msgs: {
    'strings$': 'The <%=property%> rule needs a string or array of strings (property: <%=parentpath%>).'
  }
})


exp.Parambulator = Parambulator


module.exports = exp