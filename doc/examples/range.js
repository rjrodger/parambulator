/*

Create a custom rule
====================

The parambulator function takes a second argument ('pref') that lets you define
custom rules:

  var paramcheck = parambulator( {...}, { rules:{ mycustomrule$: function(){...} } } )

Here, a range$ rule is defined to check that property values fall
within a given numerical range.  A custom error message pattern is
also defined - this is optional. And a validity check (also optional)
is defined. The validity check lets you ensure that param specs
specify the custom rule correctly.

*/


var _             = require('underscore')
var parambulator  = require('parambulator')


// this is the pref argument, defined as a separate object so that it can be reused.
var customrules = {

  // define the rules by name (the $ suffix is required)
  rules: {

    // each rule is a function that takes the current context (ctxt), and a callback (cb)
    range$: function(ctxt,cb) {

      // ctxt.rule provides you with the rule options as used in the param spec
      // in this case, rule.spec is an array with two elements, a min and max number
      var min = ctxt.rule.spec[0]
      var max = ctxt.rule.spec[1]
      
      // ctxt.point is the current value to be verified, and can be a primitive 
      // value (e.g. a string), or a complex value (e.g. an object)
      var val = ctxt.point

      // if the value is a number ... (remember to check for NaN!)
      if( _.isNumber(val) && !_.isNaN(val) ) {

        // ... but the value is outside the range
        if( val < min || max < val ) {

          // generate an Error object, using the message pattern below
          return ctxt.util.fail(ctxt,cb)
        }
      }

      // if you get to here, the rule passes
      return cb()
    }
  },

  // you can define custom error messages
  msgs: {
    
    // the template syntax is provided by the underscore library
    // see http://underscorejs.org/#template
    // available vars are value (the failing value), rule (.spec has the options), 
    // and parentpath (dot-separated property path to the point)
    range$: 'The value <%=value%> is not within the range <%=rule.spec%> (property <%=parentpath%>).'
  },

  // this is a param spec that is applied to param specs to ensure they are valid
  // use this to define the valid options for your new rule
  // in this case, range$ rule spec must be an array of length 2, containing only numbers
  // also, note that the prop$ rule is used, as a literal 'range$' would trigger a rule check
  // this is how you escape $ chars at the end of property names
  valid: {

    // can't use range$ directly, as that would trigger an actual range check!
    prop$:{
      name:'range$',

      // these are the rules for range$
      rules:{
        
        // it must be an array - e.g. [10,20]
        type$:'array',

        // it must be an array of length 2 - [min, max]
        required$:['0','1'],

        // all property values must be numbers (array indexes are treated as properties: '0','1',...) 
        '*':{type$:'number'}
      }
    }
  }
}


// create an instance to check the 'volume' parameter
// http://www.youtube.com/watch?v=EbVKWCpNFhY
var rangeparams = parambulator({ volume: {range$:[0,11]} }, customrules)


// print out any errors
function printresult(err,res) {
  if(err) console.log(err.message);
}



// this fails
rangeparams.validate( { volume: -1 }, printresult )
// output: The value -1 is not within the range 0,11 (property volume).


// these pass
rangeparams.validate( { volume: 0  }, printresult )
rangeparams.validate( { volume: 5  }, printresult )
rangeparams.validate( { volume: 11 }, printresult )


// this fails
rangeparams.validate( { volume: 12 }, printresult )
// output: The value 12 is not within the range 0,11 (property volume).



// these all fail - range$ rule spec is invalid in each case
// note the parent path - array indexes are treated the same as any other properties

try { parambulator({ volume: {range$:1} }, customrules) } catch(e) { console.log(e.message) }
// output: The value '1' is not of type 'array' (parent: volume.range$).

try { parambulator({ volume: {range$:[]} }, customrules) } catch(e) { console.log(e.message) }
// output: The property 0 is missing and is always required (parent: volume.range$).

try { parambulator({ volume: {range$:['a',1]} }, customrules) } catch(e) { console.log(e.message) }
// output: The value 'a' is not of type 'number' (parent: volume.range$.0).

// the above tests are using parambulator to check it's own input parameters

